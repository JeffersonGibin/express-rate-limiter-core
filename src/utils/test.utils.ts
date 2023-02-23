export const transformHeaderCallsInObject = (
  callHeaders: jest.Mock<any, any, any>
) => {
  return callHeaders.mock.calls.reduce((obj, call) => {
    const [key, value] = call;
    obj[key] = value;
    return obj;
  }, {});
};
