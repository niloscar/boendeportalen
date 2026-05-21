export default function useAuth() {
    const MOCK_DATA = {
        profile: {
            "id": "d303d9c0-b040-4c7d-bb84-113951251ae0",
            "email": "oscar@ondproduktion.se",
            "full_name": "Oscar Nilsson",
            "phone": "0707645060",
            "avatar_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Default_pfp.jpg/250px-Default_pfp.jpg",
            "role": "admin",
            "status": "active",
            "created_at": "2026-05-20T11:03:00.848264+00:00",
            "updated_at": "2026-05-20T11:35:00.45351+00:00",
            "deleted_at": null
        },
            user: {
                "id": "d303d9c0-b040-4c7d-bb84-113951251ae0",
                "aud": "authenticated",
                "role": "authenticated",
            "email": "oscar@ondproduktion.se",
            "email_confirmed_at": "2026-05-20T11:03:00.923994Z",
            "phone": "",
            "confirmed_at": "2026-05-20T11:03:00.923994Z",
            "last_sign_in_at": "2026-05-21T08:50:28.95997Z",
            "app_metadata": {
                "provider": "email",
                "providers": [
                    "email"
                ]
            },
            "user_metadata": {
                "email": "oscar@ondproduktion.se",
                "email_verified": true,
                "phone_verified": false,
                "sub": "d303d9c0-b040-4c7d-bb84-113951251ae0"
            },
            "identities": [
                {
                    "identity_id": "342087c9-2b0a-414a-b70a-ebb87fc30b1d",
                    "id": "d303d9c0-b040-4c7d-bb84-113951251ae0",
                    "user_id": "d303d9c0-b040-4c7d-bb84-113951251ae0",
                    "identity_data": {
                        "email": "oscar@ondproduktion.se",
                        "email_verified": false,
                        "phone_verified": false,
                        "sub": "d303d9c0-b040-4c7d-bb84-113951251ae0"
                    },
                    "provider": "email",
                    "last_sign_in_at": "2026-05-20T11:03:00.912191Z",
                    "created_at": "2026-05-20T11:03:00.912242Z",
                    "updated_at": "2026-05-20T11:03:00.912242Z",
                    "email": "oscar@ondproduktion.se"
                }
            ],
            "created_at": "2026-05-20T11:03:00.851574Z",
            "updated_at": "2026-05-21T08:50:28.978729Z",
            "is_anonymous": false
        },
        loading: false
    }
    
    return MOCK_DATA
}