import { mount } from '@vue/test-utils';
import FileUD from './compoents/FileUD3.vue';
import { expect, it } from 'vitest';

it('点击上传按钮触发 openFile', async () => {
    const wrapper = mount(FileUD, {
        props: {
            type: 'up',
            value: [],
            fileProps: { fileName: 'fileName', url: 'url', fileSize: 'fileSize', fileType: 'fileType' },
        },
    });
    await wrapper.find('.el-button').trigger('click');
    // 假设 openFile 会 emit 一个 open-file 事件
    expect(wrapper.emitted()).toHaveProperty('open-file');
});
