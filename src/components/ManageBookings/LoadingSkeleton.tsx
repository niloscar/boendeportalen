import { Skeleton, Box } from "@mui/material";

const LoadingSkeleton = () => {
    return (
        <div>
            <Box sx={{ p: 2 }}>
                <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
            </Box>

        </div>
    )
}

export default LoadingSkeleton
