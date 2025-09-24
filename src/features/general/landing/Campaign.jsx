import { useNavigate } from "react-router-dom";
import FirebaseImg from "../../../components/FirebaseImg/FirebaseImg";
import { icons } from "../../../constants/icons";

import { Box, Card, CardContent, CardMedia, Typography, Stack } from "@mui/material";

function Campaign({ data }) {
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                boxShadow: 3,
                "&:hover": { boxShadow: 3 },
                width: "20rem",
                cursor: "pointer",
            }}
            onClick={() => navigate(`/campaign/${data._id}`)}
        >
            <CardMedia>
                <FirebaseImg
                    fileName={data.bannerUrl}
                    alt={data.title}
                    style={{ width: 320, height: 300, objectFit: "cover" }}
                />
            </CardMedia>

            <CardContent>
                <Typography className="text-truncate" variant="subtitle1" fontWeight={500} noWrap>
                    {data.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {data.location}
                </Typography>

                <Stack direction="row" spacing={1}>
                    {data.socialPlatforms.map((platform) => (
                        <Box key={platform} fontSize={22}>
                            {icons[platform]}
                        </Box>
                    ))}
                </Stack>

                <Typography fontSize={13} variant="body2" color="text.secondary" mt={1} fontWeight={600}>
                    Đã ứng tuyển{" "}
                    <Typography component="span" color="primary" fontSize={13} fontWeight={600}>
                        {data.applyCount}/{data.applyLimit}
                    </Typography>
                </Typography>
            </CardContent>
        </Card>
    );
}
export default Campaign;
