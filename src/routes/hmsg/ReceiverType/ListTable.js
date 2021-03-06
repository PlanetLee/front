import React, { PureComponent, Fragment } from 'react';
import { Table } from 'hzero-ui';

import { enableRender } from 'utils/renderer';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

/**
 * 接收者类型定义-数据展示列表
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onChange - 分页查询
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @reactProps {Object} pagination - 分页器
 * @reactProps {Number} pagination.current - 当前页码
 * @reactProps {Number} pagination.pageSize - 分页大小
 * @reactProps {Number} pagination.total - 数据总量
 * @return React.element
 */
export default class ListTable extends PureComponent {
  /**
   * render
   * @returns React.element
   */
  render() {
    const { loading, dataSource, pagination, onChange, onEditType } = this.props;
    const columns = [
      {
        title: intl.get('entity.tenant.tag').d('租户'),
        dataIndex: 'tenantName',
        width: 150,
      },
      {
        title: intl.get('hmsg.receiverType.model.receiverType.typeCode').d('接收者类型编码'),
        dataIndex: 'typeCode',
        width: 150,
      },
      {
        title: intl.get('hmsg.receiverType.model.receiverType.typeName').d('描述'),
        dataIndex: 'typeName',
      },
      {
        title: intl.get('hmsg.receiverType.model.recieverType.routeName').d('服务'),
        dataIndex: 'routeName',
        width: 200,
      },
      {
        title: intl.get('hmsg.receiverType.model.recieverType.apiUrl').d('URL'),
        dataIndex: 'apiUrl',
        width: 270,
      },
      {
        title: intl.get('hzero.common.status').d('状态'),
        dataIndex: 'enabledFlag',
        width: 100,
        render: enableRender,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 100,
        render: (val, record) => (
          <a onClick={() => onEditType(record)}>{intl.get('hzero.common.button.edit').d('编辑')}</a>
        ),
      },
    ];
    return (
      <Fragment>
        <Table
          bordered
          rowKey="receiverTypeId"
          loading={loading}
          columns={columns}
          scroll={{ x: tableScrollWidth(columns) }}
          dataSource={dataSource}
          pagination={pagination}
          onChange={page => onChange(page)}
        />
      </Fragment>
    );
  }
}
