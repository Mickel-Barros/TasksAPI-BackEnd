import { validateRequest } from "../validators/validateRequest";
import { validationResult } from "express-validator";

jest.mock("express-validator");

describe("validateRequest middleware", () => {
  const mockReq = {} as any;
  const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const mockNext = jest.fn();

  it("deve chamar next se não houver erros", () => {
    (validationResult as any).mockReturnValue({ isEmpty: () => true });
    validateRequest(mockReq, mockRes as any, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it("deve retornar 400 se houver erros", () => {
    (validationResult as any).mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "erro", param: "title" }],
    });
    validateRequest(mockReq, mockRes as any, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ errors: [{ msg: "erro", param: "title" }] });
  });
});
