import axiosIns from "./axiosIns";

export const generatePdf = async (html) => {
    return axiosIns.post('/generate-pdf', { html }, { responseType: 'blob' })
        .then((response) => {
            // Create a URL for the blob received in response
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.pdf');
            document.body.appendChild(link);
            link.click();
            // Clean up after download
            link.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};