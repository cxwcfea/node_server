import _ from 'lodash';

function fetchCaptcha(codeLen) {
  let code = '';
  for (let i = 0; i < codeLen; ++i) {
    code += _.random(9);
  }
  return code;
}

export { fetchCaptcha };
