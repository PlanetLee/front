import React, { PureComponent } from 'react';
import { Form, Button, Input, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import cacheComponent from 'components/CacheComponent';

import intl from 'utils/intl';

/**
 * 审批方式查询表单
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onSearch - 查询
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hwfl/setting/approve-way' })
export default class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields(err => {
        if (!err) {
          // 如果验证成功,则执行search
          onSearch();
        }
      });
    }
  }

  /**
   * 重置
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form: { getFieldDecorator },
      category,
    } = this.props;
    return (
      <Form layout="inline">
        <Form.Item label={intl.get('hwfl.common.model.process.class').d('流程分类')}>
          {getFieldDecorator('category', {})(
            <Select style={{ width: '150px' }} allowClear>
              {category.map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {item.meaning}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label={intl.get('hwfl.common.model.common.code').d('编码')}>
          {getFieldDecorator('code', {})(<Input typeCase="upper" trim inputChinese={false} />)}
        </Form.Item>
        <Form.Item label={intl.get('hwfl.common.model.common.description').d('描述')}>
          {getFieldDecorator('description', {})(<Input />)}
        </Form.Item>
        <Form.Item>
          <Button data-code="search" type="primary" htmlType="submit" onClick={this.handleSearch}>
            {intl.get('hzero.common.status.search').d('查询')}
          </Button>
          <Button data-code="reset" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
            {intl.get('hzero.common.status.reset').d('重置')}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
