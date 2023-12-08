import axiosIntercept from "..";
import { Props } from "../interface";

export const tenant = async (props: Props) => {
  try {
    const url = `bff/api/v1/tenant/${props?.url ?? ""}`;
    const response = await axiosIntercept({
      ...props,
      url,
    });
    console.log("jhvjhvjhjhv", response);

    return response;
    // return axiosIntercept({
    //   ...props,
    //   url,
    // });
  } catch (error) {
    console.log("error from tenant", error);
    throw error;
  }
};
