import { API_URL } from "./API_URL";
export const getCustomerByCode = async (code) => {
  try {
    const response = await fetch(`${API_URL}/api/customer/code/${code}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
};
