/* eslint-disable @typescript-eslint/no-explicit-any */
export const transformHeaderCallsInObject = (
  callHeaders: jest.Mock<unknown, any, unknown>
) => {
  return callHeaders.mock.calls.reduce((obj, call) => {
    const [key, value] = call;
    obj[key] = value;
    return obj;
  }, {});
};
