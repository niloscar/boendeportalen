# Data Flow Diagram — Boendeportalen

Diagrammen är skrivna i Mermaid. Rendera med:
- **VS Code**: installera [Mermaid Preview](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid)
- **GitHub**: renderas automatiskt i markdown-filer
- **Online**: klistra in i [mermaid.live](https://mermaid.live)

> Radbrytningar i noder görs med `<br/>` och kantetiketter med specialtecken (`/`, `()`, `===`) citeras — annars riskerar Mermaid parse errors.

---

## 1. Övergripande systemöversikt

```mermaid
flowchart TB
    subgraph EXTERN["Externa aktörer"]
        U([Hyresgäst])
        A([Admin])
    end

    subgraph APP["React-applikation"]
        AUTH["AuthContext<br/>(session, profil)"]
        FEAT["FeaturesContext<br/>(feature flags)"]

        subgraph SIDOR["Sidor / Pages"]
            HP["HomePage<br/>/"]
            AP["Auth<br/>/inloggning"]
            PP["ProfilePage<br/>/minasidor"]
            SA["SearchApartment<br/>/bostader"]
            LA["LaundryRoom<br/>/tvattstuga"]
            GS["GuestSuite<br/>/gastlagenhet"]
            PK["Parking<br/>/parkeringar"]
            AD["AdminPage<br/>/admin/*"]
        end
    end

    subgraph SB["Supabase Backend"]
        SBAUTH["Supabase Auth"]
        DB[("PostgreSQL<br/>Databas")]
        STG["Storage<br/>(filer & bilder)"]
    end

    U -->|"Loggar in / registrerar"| AP
    AP -->|"signInWithEmail / signUpWithEmail"| SBAUTH
    SBAUTH -->|"session + JWT"| AUTH
    AUTH -->|"user, profile"| SIDOR

    U -->|Navigerar| HP & PP & SA & LA & GS & PK
    A -->|Navigerar| AD

    FEAT -->|"is_active-flaggor"| HP & AD

    SIDOR -->|API-anrop| DB
    SIDOR -->|"Läser / laddar upp"| STG
    DB -->|Data| SIDOR
    STG -->|"Signerade URL:er / filer"| SIDOR
```

---

## 2. Autentiseringsflöde

```mermaid
flowchart TD
    START([Besökare laddar appen]) --> INIT["AuthProvider<br/>getSession()"]
    INIT -->|"Ingen session"| GUEST["Gästläge<br/>(publika sidor tillgängliga)"]
    INIT -->|"Session finns"| GETUSER["getUser()<br/>hämtar profil från users-tabellen"]
    GETUSER --> AUTHED["Autentiserad<br/>(privata sidor upplåses)"]

    GUEST -->|"Klickar Logga in"| LOGINFORM["Login / Register<br/>/inloggning"]
    LOGINFORM -->|"signInWithEmail / signInWithProvider (Google)"| SBAUTH["Supabase Auth"]
    SBAUTH -->|"JWT-session"| AUTHCTX["AuthContext uppdateras<br/>(user, session, profile)"]
    AUTHCTX --> AUTHED

    AUTHED -->|"hasAdminAccess(profile)"| ADMINROUTE["Admin-sidor<br/>/admin/*"]
    AUTHED -->|"Vanlig hyresgäst"| PRIVATEROUTE["Privata sidor<br/>/minasidor, /tvattstuga, ..."]

    AUTHED -->|signOut| GUEST
```

> Behörighet styrs av `hasAdminAccess(profile)` ([utils/accessControl.ts](../src/utils/accessControl.ts)), som ger åtkomst om `role === 'admin'` **eller** `isAdmin === true`.

---

## 3. Profilsida — dataflöde

```mermaid
flowchart TD
    USER([Hyresgäst]) -->|"Öppnar /minasidor"| PP["ProfilePage"]
    PP -->|"userId från AuthContext"| HOOK["useProfileData(userId, authLoading)"]

    HOOK -->|Parallella anrop| P1["getUserProfile()<br/>→ users"]
    HOOK -->|Parallella anrop| P2["getApartmentForUser()<br/>→ contracts + apartments"]
    HOOK -->|Parallella anrop| P3["getAppliedApartments()<br/>→ apartment_sign_up"]
    HOOK -->|Parallella anrop| P4["getMyParking()<br/>→ parking_spots"]
    HOOK -->|Parallella anrop| P5["getAppliedParking()<br/>→ parking_applications"]

    P2 -->|"apartmentId finns"| P6["getApartmentDocuments()<br/>→ apartment_documents"]
    P2 -->|"apartmentId finns"| P8["getApartmentEquipment()<br/>→ apartment_equipment"]
    P6 -->|file_path| P7["getApartmentFileSignedUrl()<br/>→ Storage"]
    P7 -->|"Tidsbegränsad URL"| P6

    PP -->|Visar| SEC1["PersonalInfoSection"]
    PP -->|Visar| SEC2["ApartmentOverviewCard"]
    PP -->|Visar| SEC3["ApartmentDocumentsSection"]
    PP -->|Visar| SEC4["AppliedApartmentsSection"]
    PP -->|Visar| SEC5["MyParkingSection"]
    PP -->|Visar| SEC6["AppliedParkingSection"]
    PP -->|Visar| SEC7["ProfileFormsSection"]

    SEC1 -->|"Redigera profil"| UPD["updateUserProfile()<br/>uploadAvatar()"]
    SEC7 -->|"Skicka felanmälan"| REP["createErrorReport()<br/>uploadErrorReportAttachment()"]
    SEC7 -->|"Skicka serviceärende"| SRV["createServiceRequest()"]

    UPD --> DB[("users<br/>avatars/")]
    REP --> DB2[("error_reports<br/>report-attachments/")]
    SRV --> DB3[("service_requests")]
```

> Kontraktets PDF i `ApartmentOverviewCard` hämtas via `getContractSignedUrl()`.

---

## 4. Lägenhetssökning & intresseanmälan

```mermaid
flowchart TD
    USER([Hyresgäst]) -->|"Öppnar /bostader"| SA["SearchApartment"]
    SA -->|"getAvailableApartments()"| DB[("available_apartments")]
    DB -->|"ApartmentData[]"| SA
    SA -->|"Klientfiltrering (rum, hyra, område)"| LIST["ApartmentList<br/>+ ApartmentCard"]

    LIST -->|"Klickar på lägenhet"| DET["Apartment<br/>/bostader/:apartmentId"]
    DET -->|"getApartmentSignupStatus()"| DB2[("apartment_sign_up")]
    DB2 -->|"Redan anmäld?"| DET

    DET -->|"Klickar Intresseanmälan"| FORM["ApartmentSignUp<br/>formulär"]
    FORM -->|"createApartmentSignUp()"| DB3[("apartment_sign_up<br/>INSERT")]
    DB3 -->|Bekräftelse| FORM

    FORM -->|"Visas sedan i"| PROF["ProfilePage<br/>AppliedApartmentsSection"]
```

---

## 5. Bokningsflöden (Tvättstuga & Gästlägenhet)

```mermaid
flowchart TD
    USER([Hyresgäst]) -->|"Öppnar /tvattstuga"| LA["LaundryRoom.tsx"]
    USER -->|"Öppnar /gastlagenhet"| GS["GuestSuite.tsx"]

    LA -->|"fetchLaundrySlots()"| TS[("laundry_time_slots")]
    LA -->|"fetchBookedSlots()"| LB[("laundry_bookings")]
    TS & LB --> LACAL["LaundryRoomCalendar<br/>(FullCalendar)"]

    GS -->|"fetchBookedSlots()"| GB[("guest_suite_bookings")]
    GB --> GSCAL["GuestSuiteCalendar<br/>(FullCalendar)"]

    LACAL -->|"Klickar ledig tid"| BOOK_LA["useBookingActions()<br/>Öppnar dialog"]
    GSCAL -->|"Klickar ledig dag"| BOOK_GS["useBookingActions()<br/>Öppnar dialog"]

    BOOK_LA -->|Bekräftar| CREATE_LA["createLaundryRoomBooking()<br/>→ laundry_bookings INSERT"]
    BOOK_GS -->|Bekräftar| CREATE_GS["createGuestSuiteBooking()<br/>→ guest_suite_bookings INSERT"]

    BOOK_LA -->|"Avbokar (egen)"| DEL_LA["deleteLaundryRoomBooking()<br/>→ laundry_bookings DELETE"]
    BOOK_GS -->|"Avbokar (egen)"| DEL_GS["deleteGuestSuiteBooking()<br/>→ guest_suite_bookings DELETE"]

    CREATE_LA & DEL_LA -->|"refreshBookings()"| LACAL
    CREATE_GS & DEL_GS -->|"refreshBookings()"| GSCAL
```

---

## 6. Parkering — filtrering & ansökan

```mermaid
flowchart TD
    USER([Hyresgäst]) -->|"Öppnar /parkeringar"| PK["Parking.tsx"]
    PK -->|"useParkingPage()"| REDUCER["parkingPageReducer<br/>(filters + pagination)"]
    REDUCER <-->|"Persist state"| LS["localStorage<br/>parkingStorage"]

    REDUCER -->|"fetchParkingSpots(filters)"| DB[("parking_spots")]
    DB -->|"ParkingSpot[]"| REDUCER

    REDUCER -->|"Klientsidig filtrering + sortering"| LIST["ParkingList<br/>+ ParkingCard"]

    LIST -->|"Öppnar /parkeringar/:parkingId"| DET["ParkingDetails"]
    DET -->|"Klickar Ansök"| APPLY["setParkingSpotRenter()<br/>eller createParkingApplication()"]
    APPLY --> DB2[("parking_spots /<br/>parking_applications")]
    DB2 -->|Bekräftelse| DET

    APPLY -->|"Visas sedan i"| PROF["ProfilePage<br/>AppliedParkingSection / MyParkingSection"]
```

---

## 7. Admin — dashboard, användare & inställningar

```mermaid
flowchart TD
    ADMIN([Admin]) -->|"Öppnar /admin/*"| AD["AdminPage<br/>(shell + DropDown-navigering)"]
    AD --> DASH["DashboardPage<br/>/admin/dashboard"]
    AD --> USERS["UsersPage<br/>/admin/users"]
    AD --> SET["SettingsPage<br/>/admin/settings"]

    %% Inställningar / feature flags
    SET -->|"useFeatures()"| FC["FeaturesProvider"]
    FC -->|"getFeatures()"| DBF[("features")]
    DBF -->|"Feature[]"| FC
    SET -->|"toggleFeature() → saveFeatures()"| SAVE["updateFeatureStatuses()"]
    SAVE -->|"PATCH features"| DBF

    %% Dashboard-widgetar (styrs av admin_widgets-flaggor)
    DASH -->|"is_active admin_widgets"| WGRID["Widget-rutnät<br/>(Masonry)"]
    WGRID --> WISSUES["Issues"]
    WGRID --> WMSG["Messages<br/>(se sektion 8)"]
    WGRID --> WTEN["Tenants"]
    WGRID --> WRES["Resources"]

    WISSUES -->|"getIssues()"| VER[("admin_error_reports (vy)")]

    %% Användarhantering
    USERS -->|"getUsers()"| DBU[("users")]
    USERS -->|"updateUser() / deleteUser()"| DBU
```

---

## 8. Meddelanden (admin → hyresgäster)

```mermaid
flowchart TD
    ADMIN([Admin]) -->|"Öppnar Messages-widget"| MW["Messages-widget<br/>(DashboardPage)"]

    MW -->|"getMessagesForCurrentUser()"| VMY[("my_messages (vy)")]
    VMY -->|"Message[]"| MW

    MW -->|"Skapar nytt meddelande"| FORM["Formulär<br/>(ämne, text, publiceringstid, mottagare)"]
    FORM -->|"createMessage()"| API["messagesApi"]

    API -->|"Slår upp mottagare<br/>(all_tenants / filtered_users / single_user)"| VCAND[("message_recipient_candidates (vy)")]
    API -->|INSERT| DBM[("messages")]
    API -->|"INSERT (en rad per mottagare)"| DBR[("message_recipients")]

    DBM & DBR -->|Bekräftelse| MW
```

---

## Databastabeller — sammanfattning

| Tabell / vy | Beskrivning |
|-------------|-------------|
| `auth.users` | Supabase-hanterade användarkonton |
| `users` | Utökad användarprofil (namn, telefon, roll) |
| `available_apartments` | Lediga lägenheter att söka |
| `apartments` | Alla lägenheter (inkl. hyrda) |
| `apartment_equipment` | Utrustning kopplad till en lägenhet |
| `contracts` | Hyreskontrakt (kopplar hyresgäst ↔ lägenhet) |
| `apartment_sign_up` | Intresseanmälningar på lägenheter |
| `apartment_documents` | Manualer, planritningar etc. |
| `laundry_time_slots` | Tillgängliga tvättstider |
| `laundry_bookings` | Bokade tvättider |
| `guest_suite_bookings` | Bokade gästlägenheter |
| `parking_spots` | Parkeringsplatser |
| `parking_applications` | Ansökningar om parkering |
| `error_reports` | Felanmälningar |
| `error_report_attachments` | Bilagor till felanmälningar |
| `service_requests` | Serviceärenden |
| `features` | Feature flags |
| `messages` | Meddelanden skapade av admin |
| `message_recipients` | Koppling meddelande ↔ mottagare |
| `admin_error_reports` *(vy)* | Adminvy över felanmälningar (Issues-widget) |
| `my_messages` *(vy)* | Inloggad användares meddelanden |
| `message_recipient_candidates` *(vy)* | Möjliga mottagare för utskick |
