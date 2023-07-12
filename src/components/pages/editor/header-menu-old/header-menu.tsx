// import styles from './header-menu.module.scss';

// import React from 'react';
// import { HeaderMenuProps, HeaderMenuState } from './header-menu';
// import Button from '@components/button/button';
// import Menu, { Option, MenuHr as Hr } from '@components/menu/menu';



// export default class HeaderMenu extends React.Component {
//     props: Readonly<HeaderMenuProps>;
//     state: Readonly<HeaderMenuState>;

//     constructor(props: HeaderMenuProps) {
//         super(props);
//         this.state = { item: 'none' };
//     }

//     render() {
//         const { item } = this.state;

//         return (<div className={styles['header-menu']}>
//             <Button noShadow={true} key={'file' + item} showMenu={item === 'file'} onClick={(() => { this.setState({ item: 'file' }); })} menu={<Menu>
//                 {/* <Option onClickHandler={() => { Chart.saveChart('project'); }}>保存</Option>
//                 <Option onClickHandler={() => { Chart.saveChart('project', { download: true }); }}>导出</Option>
//                 <Option onClickHandler={() => { Chart.saveChart('release'); }}>保存 json</Option>
//                 <Option onClickHandler={() => { Chart.saveChart('release', { download: true }); }}>导出 json</Option>
//                 <Option onClickHandler={(_ev, checked) => {
//                     setConfig('autoSaveChartTime', checked ? 60000 : 0);
//                     Chart.autoSaveChart();
//                 }} checked={!!getConfig('autoSaveChartTime')}>自动保存</Option> */}
//             </Menu>}>文件</Button>
//             <Button noShadow={true} key={'edit' + item} showMenu={item === 'edit'} onClick={(() => { this.setState({ item: 'edit' }); })} menu={<Menu>
//                 {/* <Option onClickHandler={undo}>撤销</Option>
//                 <Option onClickHandler={redo}>重做</Option>
//                 <Hr></Hr>
//                 <Option onClickHandler={(_ev, checked) => { tempConfig.referenceLineAlign = checked; }}
//                     checked={tempConfig.referenceLineAlign}>对齐参考线</Option> */}
//             </Menu>}>编辑</Button>
//             <Button noShadow={true} key={'view' + item} showMenu={item === 'view'} onClick={(() => { this.setState({ item: 'view' }); })} menu={<Menu>
//                 {/* <Option onClickHandler={async (_ev, checked) => {
//                     let fps = 0;
//                     if (checked) {
//                         fps = 30;
//                     }
//                     setConfig('maxFPS', fps);
//                     ticker.maxFPS = fps;
//                 }} checked={getConfig('maxFPS') !== 0}>限制帧率</Option>
//                 <Option onClickHandler={async (_ev, checked) => { setResolution(checked); }}
//                     checked={getConfig('lowResolution')}>低分辨率</Option> */}
//                 {/* <Hr></Hr> */}
//                 {/* <Option onClickHandler={() => {Stage.reset}}></Option> */}
//             </Menu>}>视图</Button>
//             <Button noShadow={true} key={'preview' + item} showMenu={item === 'preview'} onClick={(() => { this.setState({ item: 'preview' }); })} menu={<Menu>
//                 {/* <Option key={`${Preview.connected}`}
//                     onClickHandler={() => { Preview.connected ? Preview.disconnect() : Preview.connect(); }}
//                     disabled={!tempConfig.canPreview}>{Preview.connected ? '断开预览器连接' : '连接预览器'}</Option>
//                 <Option onClickHandler={() => { Preview.preview(); }} disabled={!tempConfig.canPreview}>从当前位置预览</Option>
//                 <Option onClickHandler={() => { Preview.preview(0); }} disabled={!tempConfig.canPreview}>从头预览</Option> */}
//             </Menu>}>预览</Button>
//         </div>);
//     }
// }