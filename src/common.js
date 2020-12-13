import _ from 'lodash';
import './common.less';
export const fn = () => {
    console.log('common', _.chunk(['a', 'b', 'c', 'd'], 2));
};

