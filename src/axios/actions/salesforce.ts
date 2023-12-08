import axiosIntercept from "..";
import { Props } from "../interface";

export const salesforce = async (props: Props) => {
  try {
    const url = `bff/api/v1/connector/${props?.url ?? ''}`;
    const response = await axiosIntercept({
      ...props,
      url,
    });
    return response;
   
  } catch (error) {
    console.log("error from salesforce", error);
    throw error;
  }
};
