import React from 'react';
import { Card, Avatar } from 'hzero-ui';
import { Link } from 'dva/router';
import moment from 'moment';
import styles from './Project.less';

const notice = [
  {
    id: 'xxx1',
    title: 'Alipay',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
    description: '那是一种内在的东西，他们到达不了，也无法触及的',
    updatedAt: '2018-06-29T02:54:51.055Z',
    member: '科学搬砖组',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx2',
    title: 'Angular',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
    description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
    updatedAt: '2017-07-24T00:00:00.000Z',
    member: '全组都是吴彦祖',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx3',
    title: 'Ant Design',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
    description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
    updatedAt: '2018-06-29T02:54:51.055Z',
    member: '中二少女团',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx4',
    title: 'Ant Design Pro',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    description: '那时候我只会想自己想要什么，从不想自己拥有什么',
    updatedAt: '2017-07-23T00:00:00.000Z',
    member: '程序员日常',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx5',
    title: 'Bootstrap',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
    description: '凛冬将至',
    updatedAt: '2017-07-23T00:00:00.000Z',
    member: '高逼格设计天团',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx6',
    title: 'React',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
    description: '生命就像一盒巧克力，结果往往出人意料',
    updatedAt: '2017-07-23T00:00:00.000Z',
    member: '骗你来学计算机',
    href: '',
    memberLink: '',
  },
];
export default class Project extends React.Component {
  render() {
    return (
      <Card
        className={styles.projectList}
        style={{ marginBottom: 24 }}
        title="进行中的项目"
        bordered={false}
        extra={<Link to="/">全部项目</Link>}
        bodyStyle={{ padding: 0 }}
      >
        {notice.map(item => (
          <Card.Grid className={styles.projectGrid} key={item.id}>
            <Card bodyStyle={{ padding: 0 }} bordered={false}>
              <Card.Meta
                title={
                  <div className={styles.cardTitle}>
                    <Avatar size="small" src={item.logo} />
                    <Link to={item.href}>{item.title}</Link>
                  </div>
                }
                description={item.description}
              />
              <div className={styles.projectItemContent}>
                <Link to={item.memberLink}>{item.member || ''}</Link>
                {item.updatedAt && (
                  <span className={styles.datetime} title={item.updatedAt}>
                    {moment(item.updatedAt).fromNow()}
                  </span>
                )}
              </div>
            </Card>
          </Card.Grid>
        ))}
      </Card>
    );
  }
}
