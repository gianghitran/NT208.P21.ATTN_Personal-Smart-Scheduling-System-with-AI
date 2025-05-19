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

export const getInvitedUsersByEvent = async (access_token, eventId, axiosJWT) => {
    try {
        const res = await axiosJWT.get(`/api/collab/invites/${eventId}`, {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching invited users:", error);
        return { invitedUser: [], ownerEmail: "", isOwner: false };
    }
}

export const shareEvents = async (access_token, email, eventId, axiosJWT) => {
    try {
        const res = await axiosJWT.post(`/api/collab/share`, {
            eventId,
            email,
        }, 
        {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        return res;
    } catch (error) {
        return error.response;
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

export const updateRole = async (access_token, updatedUser, eventId, axiosJWT) => {
    try {
        const res = await axiosJWT.patch(`/api/collab/update-role`, {
            updatedUser,
            eventId,
        }, 
        {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        return res.data;
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