import axios from "axios";

export async function uploadPDFToBackend(file) {
  const formData = new FormData();
  formData.append("pdf", file);

  try {
    const response = await axios.post(
      "http://localhost:5000/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status !== 200 || !response.data.url) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    console.log("File uploaded to:", response.data.url);
    return response.data.url;
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw error;
  }
}
