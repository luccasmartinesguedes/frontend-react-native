import * as SecureStore from "expo-secure-store";

import api from "./api";

async function getAccessToken() {
  const token = await SecureStore.getItemAsync("access_token");

  if (!token) {
    throw new Error("Token de acesso não encontrado.");
  }

  return token;
}

export async function getTasks() {
  const token = await getAccessToken();

  const response = await api.get("/tasks/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function createTask(title, description) {
  const token = await getAccessToken();

  const response = await api.post(
    "/tasks/",
    {
      title,
      description,
      status: "pending",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function updateTask(id, data) {
  const token = await getAccessToken();

  const response = await api.patch(`/tasks/${id}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function deleteTask(id) {
  const token = await getAccessToken();

  await api.delete(`/tasks/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}