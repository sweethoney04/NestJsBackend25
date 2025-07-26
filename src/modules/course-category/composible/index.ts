import apiClient from "../../../common/configuration/axios.config";
import type { IFormStateCategory } from "../interface/category.interface";

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

  const createItem = async (value: IFormStateCategory) => {
    const response = await apiClient.post(`/course/create-category`, {
      name: value.name,
    });
    return response.data;
  };

  const updateItem = async (value: IFormStateCategory) => {
    const response = await apiClient.put(
      `/course/update-category/${value.id}`,
      {
        name: value.name,
      }
    );
    return response.data;
  };

  const deleteItem = async (id: number) => {
    const response = await apiClient.delete(`/course/delete-category/${id}`);
    return response.data;
  };

  return {
    fetchAll,
    updateItem,
    deleteItem,
    createItem,
  };
}
