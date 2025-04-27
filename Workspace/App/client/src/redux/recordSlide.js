import { createSlice } from '@reduxjs/toolkit';

const recordSlice = createSlice({
    name: 'record',
    initialState: {
        record: JSON.parse(sessionStorage.getItem('record')) || null, 
        loading: false, // Trạng thái loading
    },

    reducers: {
        setRecord: (state, action) => {
            try {
                if (state.record) {
                    sessionStorage.removeItem('record');
                }
                state.record = action.payload;
                sessionStorage.setItem('record', JSON.stringify(state.record));
            } catch (error) {
                console.error('Lỗi khi thêm file record:', error);
            }
        },

        loadRecord: (state) => {
            try {
                const storedRecord = sessionStorage.getItem('record');
                state.record = storedRecord ? JSON.parse(storedRecord) : null;
            } catch (error) {
                console.error('Lỗi khi load file record:', error);
                state.record = null;
            }
        },
    },
});

export const { setRecord } = recordSlice.actions;

export default recordSlice.reducer;
