type InputErrorsType = {
  required?: boolean;
  length?: {
    min: number;
    max: number;
  };
  format?: {
    regex: RegExp;
    message: string;
  };
  state?: {
    active: boolean;
    message: string;
  };
};
