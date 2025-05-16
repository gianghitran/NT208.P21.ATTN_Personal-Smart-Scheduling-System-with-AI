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

export const readNotification = async (access_token, inviteId, axiosJWT) => {
    try {
        const res = await axiosJWT.put(`/api/collab/read/${inviteId}`, {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        return res;
    } catch (error) {
        return error;
    }
}

export const acceptInvite = async (access_token, inviteId, axiosJWT) => {
    try {
        const res = await axiosJWT.put(`/api/collab/accept-invite/${inviteId}`, {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        return res;
    }
    catch (error) {
        return error;
    }
}

export const declineInvite = async (access_token, inviteId, axiosJWT) => {
    try {
        const res = await axiosJWT.put(`/api/collab/decline-invite/${inviteId}`, {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        return res;
    }
    catch (error) {
        return error;
    }
}