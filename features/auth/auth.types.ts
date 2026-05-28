/** Backend response envelope for the login endpoint. */
export type LoginResponse = {
  error: boolean;
  msg: string;
  data: {
    username: string;
    token: string;
    refresh_token: string;
  };
};

export type LoginPayload = {
  username: string;
  password: string;
};

/** Auth session held in the client store. */
export type AuthSession = {
  username: string;
  token: string;
  refreshToken: string;
};
