type Object = {
  [key: string]: any;
};

const checkValuesChanged = (newValues: Object, oldValues: Object) => {
  for (let key of Object.keys(newValues)) {
    if (newValues[key] !== oldValues[key]) return true;
  }
  return false;
};
export default checkValuesChanged;
