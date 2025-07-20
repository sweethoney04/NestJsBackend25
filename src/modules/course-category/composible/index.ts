import apiClient from "../../../common/configuration/axios.config";

export function CourseCategoryComposible() {
  const fetchAll = async () => {
    const response = await apiClient.get("/course/categories", {
      params: {
        page: 1,
        limit: 10,
        search: "",
      },
    });
    return response.data;
  };

  const deleteItem = async (id: number) => {
    const response = await apiClient.delete(`/course/delete-category/${id}`);
    return response.data;
  };

  return {
    fetchAll,
    deleteItem,
  };
}
