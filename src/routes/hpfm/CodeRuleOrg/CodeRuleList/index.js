/**
 * codeRuleRule - 编码规则
 * @date: 2019-1-11
 * @author: wangjiacheng <jiacheng.wang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { Form, Button, Modal, Table, Tag } from 'hzero-ui';
import { isUndefined } from 'lodash';
import { Bind } from 'lodash-decorators';

import cacheComponent from 'components/CacheComponent';
import { Header, Content } from 'components/Page';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';

import FilterForm from './FilterForm';
import CreateCode from './CreateCode';

/**
 * 编码规则
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} codeRule - 数据源
 * @reactProps {Object} fetchCodeLoading - 数据加载是否完成
 * @reactProps {Object} removeCodeLoading - 数据删除加载是否完成
 * @reactProps {Object} addCodeRuleLoading - 数据添加加载是否完成
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@formatterCollections({
  code: ['hpfm.codeRule'],
})
@connect(({ codeRuleOrg, loading }) => ({
  codeRuleOrg,
  organizationId: getCurrentOrganizationId(),
  removeCodeLoading: loading.effects['codeRuleOrg/removeCode'],
  fetchCodeLoading: loading.effects['codeRuleOrg/fetchCode'],
  addCodeRuleLoading: loading.effects['codeRuleOrg/addCodeRule'],
}))
@Form.create({ fieldNameProp: null })
@withRouter
@cacheComponent({ cacheKey: '/hpfm/code-rule/list' })
export default class codeRule extends PureComponent {
  /**
   *Creates an instance of codeRule.
   * @param {object} props 属性
   */
  constructor(props) {
    super(props);
    /**
     * 内部状态
     */
    this.state = {
      selectedRows: [],
      formValues: {},
      modalVisible: false,
    };
  }

  /**
   * 新增编码规则
   * @param {object} fieldsValue 传递的filedvalue
   * @param {object} form        表单数据
   */
  @Bind()
  handleAddCodeRule(fieldsValue, form) {
    const { dispatch, organizationId } = this.props;
    const callback = res => {
      this.setState({
        modalVisible: false,
      });
      notification.success();
      form.resetFields();
      this.showCodeRuleDist(res);
    };
    dispatch({
      type: 'codeRuleOrg/addCodeRule',
      payload: {
        ...fieldsValue,
        organizationId,
      },
    }).then(response => {
      if (response) {
        callback(response);
      }
    });
  }

  /**
   * 刷新
   */
  @Bind()
  refreshValue() {
    this.fetchCodeRuleOrgList();
    this.setState({
      selectedRows: [],
    });
  }

  /**
   * 编码规则删除
   */
  @Bind()
  deleteValue() {
    const { dispatch, organizationId, removeCodeLoading } = this.props;
    const { selectedRows } = this.state;
    const onOk = () => {
      dispatch({
        type: 'codeRuleOrg/removeCode',
        payload: {
          selectedRows,
          organizationId,
        },
      }).then(response => {
        if (response) {
          this.refreshValue();
          notification.success();
        }
      });
    };
    Modal.confirm({
      title: intl.get('hzero.common.message.confirm.remove').d('确定删除选中数据?'),
      onOk,
      removeCodeLoading,
    });
  }

  /**
   * 控制modal弹出层显隐
   * @param {boolean} flag 显/隐标记
   */
  @Bind()
  showCreateModal(flag) {
    this.setState({
      modalVisible: !!flag,
    });
  }

  /**
   * 查询数据
   * @param {object} pageData 页面基本信息数据
   */
  @Bind()
  fetchCodeRuleOrgList(pageData = {}) {
    const { dispatch, organizationId } = this.props;
    const filterValue = this.form === undefined ? {} : this.form.getFieldsValue();
    this.setState({
      formValues: filterValue,
    });
    dispatch({
      type: 'codeRuleOrg/fetchCode',
      payload: {
        ...filterValue,
        organizationId,
        ...pageData,
      },
    });
  }

  /**
   * 查询按钮点击
   * @returns
   */
  @Bind()
  queryValue() {
    this.fetchCodeRuleOrgList();
  }

  /**
   * 页面跳转到编码规则维护页面
   * @param {object} record 行数据
   */
  @Bind()
  showCodeRuleDist(record = {}) {
    const { history } = this.props;
    history.push(`/hpfm/code-rule-org/dist/${record.ruleId}`);
  }

  /**
   * 组件挂载后执行方法
   */
  componentDidMount() {
    const {
      dispatch,
      organizationId,
      codeRuleOrg: { list = {} },
      location: { state: { _back } = {} },
    } = this.props;
    dispatch({
      type: 'codeRuleOrg/settingOrgId',
      payload: {
        organizationId,
      },
    });
    const code = 'HPFM.LEVEL';
    const page = isUndefined(_back) ? {} : list.data && list.data.pagination;
    this.fetchCodeRuleOrgList({ page });
    dispatch({
      type: 'codeRuleOrg/fetchLevel',
      payload: {
        lovCode: code,
      },
    });
  }

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleStandardTableChange(pagination = {}) {
    const { organizationId } = this.props;
    const { formValues } = this.state;
    const params = {
      organizationId,
      ...formValues,
      page: pagination,
    };
    this.fetchCodeRuleOrgList(params);
  }

  /**
   * 重置form表单
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  }

  /**
   *选择数据触发方法
   * @param {null} _ 占位符
   * @param {object} rows 行记录
   */
  @Bind()
  handleSelectRows(_, rows) {
    this.setState({
      selectedRows: rows,
    });
  }

  /**
   * 获取查询表单组件this对象
   * @param {object} ref - 查询表单组件this
   */
  @Bind()
  handleBindRef(ref) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 查询表单
   */
  @Bind()
  handleSearch() {
    this.fetchCodeRuleOrgList();
  }

  /**
   * 重置查询表单
   */
  @Bind()
  handleResetSearch() {
    this.form.resetFields();
  }

  render() {
    const {
      codeRuleOrg: {
        list: { data = {} },
      },
      removeCodeLoading,
      fetchCodeLoading,
      addCodeRuleLoading,
      organizationId,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const rowSelection = {
      selectedRowKeys: selectedRows.map(n => n.ruleId),
      onChange: this.handleSelectRows,
      getCheckboxProps: record => ({
        disabled: organizationId !== record.tenantId,
      }),
    };
    const columns = [
      {
        title: intl.get('hpfm.codeRule.model.codeRule.ruleCode').d('规则代码'),
        dataIndex: 'ruleCode',
        width: 200,
      },
      {
        title: intl.get('hpfm.codeRule.model.codeRule.ruleName').d('规则名称'),
        dataIndex: 'ruleName',
      },
      {
        title: intl.get('hpfm.codeRule.model.codeRule.description').d('规则描述'),
        dataIndex: 'description',
      },
      {
        title: intl.get('hzero.common.source').d('来源'),
        align: 'center',
        width: 100,
        render: (_, record) => {
          return organizationId === record.tenantId ? (
            <Tag color="green">{intl.get('hzero.common.custom').d('自定义')}</Tag>
          ) : (
            <Tag color="orange">{intl.get('hzero.common.predefined').d('预定义')}</Tag>
          );
        },
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        align: 'center',
        width: 80,
        render: (_, record) => (
          <Fragment>
            <a
              onClick={() => {
                this.showCodeRuleDist(record);
              }}
            >
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
          </Fragment>
        ),
      },
    ];

    return (
      <React.Fragment>
        <Header title={intl.get('hpfm.codeRule.view.message.title.list').d('编码规则')}>
          <Button icon="plus" type="primary" onClick={() => this.showCreateModal(true)}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button
            icon="delete"
            loading={removeCodeLoading}
            onClick={this.deleteValue}
            disabled={selectedRows.length <= 0}
          >
            {intl.get('hzero.common.button.delete').d('删除')}
          </Button>
        </Header>
        <Content>
          <div className="table-list-search">
            <FilterForm
              onSearch={this.handleSearch}
              onReset={this.handleResetSearch}
              onRef={this.handleBindRef}
            />
          </div>
          <Table
            loading={fetchCodeLoading}
            rowKey="ruleId"
            rowSelection={rowSelection}
            dataSource={data.content}
            columns={columns}
            pagination={data.pagination || {}}
            onChange={this.handleStandardTableChange}
            bordered
          />
          <CreateCode
            modalVisible={modalVisible}
            loading={addCodeRuleLoading}
            onOk={this.handleAddCodeRule}
            onShowCreateModal={this.showCreateModal}
          />
        </Content>
      </React.Fragment>
    );
  }
}
