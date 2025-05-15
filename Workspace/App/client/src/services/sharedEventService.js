export const getInviteEvents = async (access_token, axiosJWT) => {
    try {
        const res = await axiosJWT.get(`/api/collab/invites`, {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        return res.data;
    } catch (error) {
        return [];
    }
}

export const readNotification = async (access_token, eventId, axiosJWT) => {
    try {
        const res = await axiosJWT.put(`/api/collab/read/${eventId}`, {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        return res.data;
    } catch (error) {
        return error;
    }
}