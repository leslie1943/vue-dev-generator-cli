import ssss from './src/ssss';

  /* istanbul ignore next */
  ssss.install = function (Vue) {
    Vue.component(ssss.name, ssss);
  };
  
  export default ssss;
  
  