import React, { Component } from 'react';
import { Drawer, Form, Input, Select, Switch, Button, Tooltip } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isNil, isEmpty } from 'lodash';

import Lov from 'components/Lov';

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import styles from './index.less';
// 使用 FormItem 组件
const FormItem = Form.Item;
// 使用 Option 组件
const { Option } = Select;
// 使用 TextArea 组件
const { TextArea } = Input;
// 通用表单布局
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

// hpfm 国际化前缀
const commonPrompt = 'hpfm.financialCode.view.message';
/**
 * SlideDrawer - 财务代码设置 编辑侧滑弹窗组件
 * @extends {Component} - React.Component
 * @reactProps {function} [ref= (e => e)] - react ref属性
 * @reactProps {boolean} [updateLoading=false] - 编辑保存状态
 * @reactProps {boolean} visible - 弹窗是否可见
 * @reactProps {Array<object>} typeList - 状态下拉框值集
 * @reactProps {object} editRecord - 选择编辑的行数据
 * @reactProps {function} [onOk = (e => e)] - 弹窗确定时执行
 * @reactProps {function} [onClose = (e => e)] - 弹窗关闭时执行
 * @reactProps {object} form - 表单对象
 */
@Form.create({ fieldNameProp: null })
export default class SlideDrawer extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) {
      onRef(this);
    }
    this.state = {
      valueMeaning: null,
      typeList: [],
      checkedTip: false,
      checked: null,
      parentTag: null,
    };
  }

  /**
   * 挂载完成时执行
   */
  componentDidMount() {
    this.initTypeList();
  }

  /**
   * 更新完成时执行
   */
  componentDidUpdate(prevProps) {
    const { visible } = this.props;
    if (visible && !prevProps.visible) {
      this.initTypeList();
    } else if (!visible && prevProps.visible) {
      this.reSetState();
    }
  }

  /**
   * 组件卸载时更新
   */
  componentWiiUnmount() {
    clearTimeout(this.timer);
  }

  /**
   * initTypeList - 挂载完成时获取类型值集
   */
  @Bind()
  initTypeList() {
    const { typeList, editRecord = {} } = this.props;
    const checked = !!editRecord.enabledFlag;
    const parentTag = editRecord.parenLabel;
    const valueMeaning = editRecord.parentLabelMeaning;
    const group = (typeList.find(o => o.tag === parentTag) || {}).parentValue;
    this.setState({
      parentTag,
      checked,
      valueMeaning,
      typeList: group
        ? typeList.filter(n => n.parentValue === group && n.tag === parentTag)
        : typeList.filter(o => isNil(o.parentValue)),
    });
  }

  /**
   * reSetState - 关闭时重置state
   */
  @Bind()
  reSetState() {
    this.setState({
      checked: null,
      parentTag: null,
    });
  }

  /**
   * handleSelectChange - 下拉组件改变时触发
   * @param {Array} value - 类型值集的 orderSeq 字段组成的数组
   */
  @Bind()
  handleSelectChange(value = []) {
    const orderSeq = value[0];
    const {
      typeList = [],
      clearCacheParentLabelValue = e => e,
      form: { setFieldsValue = e => e },
    } = this.props;
    const parentTag = (typeList.find(o => Number(o.orderSeq) === Number(orderSeq)) || {}).tag;
    const valueMeaning = (typeList.find(o => o.value === parentTag) || {}).meaning;
    const group = (typeList.find(o => o.orderSeq === orderSeq) || {}).parentValue;

    this.setState({
      parentTag,
      valueMeaning,
      typeList: group
        ? typeList.filter(n => n.parentValue === group && n.tag === parentTag)
        : value.length === 0
        ? typeList
        : typeList.filter(o => isNil(o.parentValue)),
    });
    clearCacheParentLabelValue();
    setFieldsValue({ codeId: undefined });
  }

  /**
   * getSelectInitValue - 获取select组件初始值
   */
  @Bind()
  getSelectInitValue() {
    const { typeList: initTypeList, editRecord = {} } = this.props;
    const currentTags =
      isNil(editRecord.type) || editRecord.type === '' ? [] : editRecord.type.split(',');
    const currentOrderSeq =
      (initTypeList || []).length === 0
        ? []
        : currentTags.map(t => ((initTypeList || []).find(o => o.value === t) || {}).orderSeq);
    return currentOrderSeq.length === 0 ? null : currentOrderSeq;
  }

  /**
   * switchChange - switch 组件变化是触发
   * @param {boolean} checked - 当前是否选中
   */
  @Bind()
  switchChange(checked) {
    const {
      editRecord: { parentEnableFlag },
    } = this.props;
    if (parentEnableFlag === 0 && checked) {
      this.setState({
        checkedTip: true,
        checked: false,
      });
      this.timer = setTimeout(() => {
        this.setState({
          checkedTip: false,
        });
      }, 3000);
    } else {
      this.setState({
        checked,
      });
    }
  }

  render() {
    const { valueMeaning, typeList = [], checkedTip, checked, parentTag } = this.state;
    const {
      visible,
      onOk,
      onClose,
      editRecord = {},
      form: { getFieldDecorator },
      updateLoading,
    } = this.props;
    const {
      parentId,
      remark,
      enabledFlag,
      name,
      code,
      levelPath,
      cacheParentLabelValue,
    } = editRecord;

    return (
      <Drawer
        title={intl.get(`${commonPrompt}.editTitle`).d('编辑财务代码')}
        visible={visible}
        onClose={onClose}
        width={450}
        destroyOnClose
      >
        <div className={styles['financial-code-drawer']}>
          <Form layout="vertical">
            <FormItem label={intl.get(`${commonPrompt}.financialCode`).d('代码')} {...formLayout}>
              {getFieldDecorator('code', {
                initialValue: code || null,
                rules: [
                  {
                    required: true,
                    message: intl
                      .get(`${commonPrompt}.validation.notNull`, {
                        name: intl.get(`${commonPrompt}.code`).d('代码'),
                      })
                      .d(`${intl.get(`${commonPrompt}.code`).d('代码')}不能为空`),
                  },
                ],
              })(<Input inputChinese={false} disabled />)}
            </FormItem>
            <FormItem label={intl.get(`${commonPrompt}.financialName`).d('名称')} {...formLayout}>
              {getFieldDecorator('name', {
                initialValue: name || null,
                rules: [
                  {
                    required: true,
                    message: intl
                      .get(`${commonPrompt}.validation.notNull`, {
                        name: intl.get(`${commonPrompt}.name`).d('名称'),
                      })
                      .d(`${intl.get(`${commonPrompt}.name`).d('名称')}不能为空`),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={intl.get(`${commonPrompt}.financialType`).d('类型')} {...formLayout}>
              {getFieldDecorator('types', {
                initialValue: this.getSelectInitValue(),
                rules: [
                  {
                    required: true,
                    message: intl
                      .get(`${commonPrompt}.validation.notNull`, {
                        name: intl.get(`${commonPrompt}.types`).d('类型'),
                      })
                      .d(`${intl.get(`${commonPrompt}.types`).d('类型')}不能为空`),
                  },
                ],
              })(
                <Select mode="multiple" onChange={this.handleSelectChange}>
                  {typeList.map(n => (
                    <Option key={n.orderSeq} value={n.orderSeq}>
                      {n.meaning}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              label={intl
                .get(`${commonPrompt}.superior${valueMeaning}`)
                .d(`上级${valueMeaning || ''}`)}
              {...formLayout}
            >
              {getFieldDecorator('codeId', {
                initialValue: parentId || null,
                rules: [].concat(
                  !isEmpty(parentTag)
                    ? {
                        required: true,
                        message: intl
                          .get(`${commonPrompt}.validation.notNull`, {
                            name: intl.get(`${commonPrompt}.types`).d('类型'),
                          })
                          .d(`${intl.get(`${commonPrompt}.types`).d('类型')}不能为空`),
                      }
                    : {}
                ),
              })(
                <Lov
                  code="HPFM.FINANCE_CODE"
                  textValue={cacheParentLabelValue}
                  queryParams={{
                    tenantId: getCurrentOrganizationId(),
                    type: parentTag,
                    levelPath,
                  }}
                />
              )}
            </FormItem>
            <FormItem label={intl.get(`${commonPrompt}.describe`).d('说明')} {...formLayout}>
              {getFieldDecorator('remark', {
                initialValue: remark || null,
              })(<TextArea rows={3} />)}
            </FormItem>
            <Tooltip
              visible={checkedTip}
              placement="bottom"
              title={intl.get(`${commonPrompt}.tipMessage`).d('父节点未启用，子节点不可启用')}
            >
              <FormItem label={intl.get(`${commonPrompt}.enable`).d('启用')} {...formLayout}>
                {
                  <Switch
                    checked={isNil(checked) ? Boolean(enabledFlag) : checked}
                    checkedChildren={intl.get(`${commonPrompt}.open`).d('开')}
                    unCheckedChildren={intl.get(`${commonPrompt}.close`).d('关')}
                    onChange={this.switchChange}
                  />
                }
              </FormItem>
            </Tooltip>
            <div className="drawer-bottom">
              <Button onClick={onClose}>{intl.get(`hzero.common.button.cancel`).d('取消')}</Button>
              <Button
                style={{ marginLeft: '8px' }}
                type="primary"
                onClick={onOk}
                loading={updateLoading}
              >
                {intl.get(`hzero.common.button.save`).d('保存')}
              </Button>
            </div>
          </Form>
        </div>
      </Drawer>
    );
  }
}
