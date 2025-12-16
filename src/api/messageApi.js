import axiosClient from "./axiosClient";

const messageApi = {
  send: (data) => {
    const formData = new FormData();
    formData.append("ticket_id", data.ticket_id);
    formData.append("text", data.text || "");
    if (data.file) {
      formData.append("file", data.file);
    }

    return axiosClient.post("/routes/messages.php?action=send", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  get: (ticketId) =>
    axiosClient.get(`/routes/messages.php?action=get&ticket_id=${ticketId}`),
};

export default messageApi;
