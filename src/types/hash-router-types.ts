export interface IRoutes {
  [key: string]: Page;
}

export type Page = {
  [key: string]: string;
};

export interface IRouter {
  locationHandler(): Promise<void>;
}
