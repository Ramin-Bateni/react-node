import axios from "axios";
import { constant } from "../constant";
import { commonUtils } from "../utils/utils";

const getBearerToken = () => {
  return `Bearer ${
    localStorage.getItem("token") || sessionStorage.getItem("token")
  }`;
};

export const postApi = async (path, data, login) => {
  try {
    path = commonUtils.slashWrapped(path);
    let result = await axios.post(constant.baseUrl + path, data, {
      headers: {
        Authorization: getBearerToken(),
      },
    });
    if (result.data?.token && result.data?.token !== null) {
      if (login) {
        localStorage.setItem("token", result.data?.token);
      } else {
        sessionStorage.setItem("token", result.data?.token);
      }
      if (!result.data) {
        throw new Error("No User data returned");
      }
      localStorage.setItem("user", JSON.stringify(result.data?.user));
    }
    return result;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const putApi = async (path, data, id) => {
  try {
    path = commonUtils.slashWrapped(path);
    const url = `${constant.baseUrl}${path}${id}`;
    let result = await axios.put(url, data, {
      headers: {
        Authorization: getBearerToken(),
      },
    });
    return result;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const deleteApi = async (path, param) => {
  try {
    path = commonUtils.slashWrapped(path);
    let result = await axios.delete(constant.baseUrl + path + param, {
      headers: {
        Authorization: getBearerToken(),
      },
    });
    if (result.data?.token && result.data?.token !== null) {
      localStorage.setItem("token", result.data?.token);
    }
    return result;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const deleteManyApi = async (path, data) => {
  try {
    path = commonUtils.slashWrapped(path);
    let result = await axios.post(constant.baseUrl + path, data, {
      headers: {
        Authorization: getBearerToken(),
      },
    });
    if (result.data?.token && result.data?.token !== null) {
      localStorage.setItem("token", result.data?.token);
    }
    return result;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const getApi = async (path, id) => {
  path = commonUtils.slashWrapped(path);
  try {
    if (id) {
      let result = await axios.get(constant.baseUrl + path + id, {
        headers: {
          Authorization: getBearerToken(),
        },
      });
      return result;
    } else {
      let result = await axios.get(constant.baseUrl + path, {
        headers: {
          Authorization: getBearerToken(),
        },
      });
      return result;
    }
  } catch (e) {
    console.error(e);
    return e;
  }
};
