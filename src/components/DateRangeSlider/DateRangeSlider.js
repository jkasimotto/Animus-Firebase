import * as React from 'react';
import { Slider, Box, Typography } from '@mui/material';
import { AuthContext } from '../../auth/auth';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from "@firebase/firestore";

export default function DateRangeSlider({ endDate }) {
    const { user } = React.useContext(AuthContext);

    const [min, setMin] = React.useState(0);
    const [max, setMax] = React.useState(new Date(endDate).getTime());
    const [value, setValue] = React.useState([0, max]);

    React.useEffect(() => {
        const fetchUserCreatedDate = async () => {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            const createdAt = userDocSnap.data().createdAt.toDate().getTime();

            setMin(createdAt);
            setValue([createdAt, max]);
        }

        fetchUserCreatedDate();
    }, [user, max]);

    const handleChange = (event, newValue) => {
        if (newValue[0] > newValue[1]) {
            setValue([newValue[1], newValue[1]]);
        } else if (newValue[1] < newValue[0]) {
            setValue([newValue[0], newValue[0]]);
        } else {
            setValue(newValue);
        }
    };

    return (
        <Box sx={{ width: 300 }}>
            <Typography id="range-slider" gutterBottom>
                Date range
            </Typography>
            <Slider
                value={value}
                onChange={handleChange}
                valueLabelFormat={x => new Date(x).toLocaleDateString()}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={min}
                max={max}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>{new Date(value[0]).toLocaleDateString()}</Typography>
                <Typography>{new Date(value[1]).toLocaleDateString()}</Typography>
            </div>
        </Box>
    );
}
