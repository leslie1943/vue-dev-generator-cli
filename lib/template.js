// -------------------------------------------- api model template
var api = function () {
  return `import fetch from '@/utils/fetch';
  /**** DEMO Start ****/
  //export function TO_DO_GET_API(params) {
  //  return fetch({
  //    method: 'get',
  //    url: '/api/TO_DO_GET_PATH/TO_DO_GET_METHODS',
  //    params: params,
  //  });
  //}

  //export function TO_DO_POST_API(data) {
  //  return fetch({
  //    method: 'post',
  //    url: '/api/TO_DO_POST_PATH/TO_DO_POST_METHODS',
  //    data: data,
  //  });
  //}
  /**** DEMO End ****/
`;
};

// -------------------------------------------- vuex module template
var storeAPI = function (props) {
  return `// DO NOT FORGET IN index.js: import { ${props.moduleName} } from './modules/ ${props.moduleName}';
  import { ${props.apiName} } from "@/api/${props.apiName}";
  export default {
    namespaced: true,
    state: {
      TO_DO_PROP: [],
    },
    mutations: {
      SET_TO_DO_PROP: (state, data) => {
        state.TO_DO_PROP = data;
      },
    },
    actions: {
      async TO_DO_FUNCTION({ commit },condition) {
        const res = await ${props.apiName}.TO_DO_FUNCTION_API(condition);
        const { status, result, msg } = res.data;
        if (status === 1 && result) {
          commit('SET_TO_DO_PROP', result);
        }else{
          console.info(msg);
        }
        return res;
      },
    },
  };
`;
};

var storeEmpty = function (props) {
  return `// DO NOT FORGET IN index.js: import { ${props.moduleName} } from './modules/ ${props.moduleName}';
  export default {
    namespaced: true,
    state: {
    },
    mutations: {
    },
    actions: {
    },
  };
`;
};

// -------------------------------------------- component index
var component  = function(props){
  const name = props.name;
  return `import ${name} from './src/${name}';

  /* istanbul ignore next */
  ${name}.install = function (Vue) {
    Vue.component(${name}.name, ${name});
  };
  
  export default ${name};
  
  `
}

// -------------------------------------------- main.scss
var scss = function(props){
  return `
  .common-${props.name}-container {
  }
  `;
}

// -------------------------------------------- vue file
var page = function(props){
  return `
  <template>
    <div class="common-${props.name}-container">

    </div>
  </template>

  <script>
  import "./main.scss";

  export default {
    name: "${props.name}",

    props: {
    },

    data(){
      return{}
    },

    created() {
    },
    
    mounted() {
    },

    methods:{
    },

    computed:{
    }
  }
  </script>

`
}


module.exports = {
  api: api,
  scss:scss,
  page:page,
  storeAPI: storeAPI,
  storeEmpty: storeEmpty,
  component: component,
};
