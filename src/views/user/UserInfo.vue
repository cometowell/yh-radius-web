<template>
  <div>
    <a-card title="用户信息" v-if="userInfo.radUser">
      <a-card-grid :class="'user-grid-25'">用户姓名：</a-card-grid>
      <a-card-grid :class="'user-grid-25'">{{userInfo.radUser.realName}}</a-card-grid>
      <a-card-grid :class="'user-grid-25'">用户账号：</a-card-grid>
      <a-card-grid :class="'user-grid-25'">{{userInfo.radUser.username}}</a-card-grid>

      <a-card-grid :class="'user-grid-25'">状态</a-card-grid>
      <a-card-grid :class="'user-grid-25'">{{userStates[userInfo.radUser.status]}}</a-card-grid>
      <a-card-grid :class="'user-grid-25'">并发数：</a-card-grid>
      <a-card-grid :class="'user-grid-25'">{{userInfo.radUser.concurrentCount}}</a-card-grid>

      <a-card-grid :class="'user-grid-25'">是否绑定Mac：</a-card-grid>
      <a-card-grid :class="'user-grid-25'">{{userInfo.radUser.shouldBindMacAddr == 1 ? '是' : '否'}}</a-card-grid>
      <a-card-grid :class="'user-grid-25'">是否绑定Vlan：</a-card-grid>
      <a-card-grid :class="'user-grid-25'">{{userInfo.radUser.shouldBindVlan == 1 ? '是' : '否'}}</a-card-grid>

      <a-card-grid :class="'user-grid-25'">外层Vlan：</a-card-grid>
      <a-card-grid :class="'user-grid-25'">{{userInfo.radUser.vlanId2}}</a-card-grid>
      <a-card-grid :class="'user-grid-25'">内层Vlan：</a-card-grid>
      <a-card-grid :class="'user-grid-25'">{{userInfo.radUser.vlanId}}</a-card-grid>

      <a-card-grid :class="'user-grid-25'">MAC地址：</a-card-grid>
      <a-card-grid :class="'user-grid-25'">{{userInfo.radUser.macAddr}}</a-card-grid>
      <a-card-grid :class="'user-grid-25'">静态IP地址：</a-card-grid>
      <a-card-grid :class="'user-grid-25'">{{userInfo.radUser.framedIpAddr}}</a-card-grid>

      <a-card-grid :class="'user-grid-50'">过期时间：</a-card-grid>
      <a-card-grid :class="'user-grid-50'">{{userInfo.radUser.expireTime}}</a-card-grid>
      <a-card-grid :class="'user-grid-50'">描述：</a-card-grid>
      <a-card-grid :class="'user-grid-50'">{{userInfo.radUser.description}}</a-card-grid>
      <a-card-grid :class="'user-grid-50'">装机地址：</a-card-grid>
      <a-card-grid
        :class="'user-grid-50'"
        style="display:block;word-break: break-all;word-wrap: break-word"
      >{{userInfo.radUser.installedAddr}}</a-card-grid>
    </a-card>
    <a-card title="订购套餐信息" v-if="userInfo.radProduct" :style="{ marginTop: '10px' }">
      <a-card-grid :class="'user-grid-25'">套餐名称：</a-card-grid>
      <a-card-grid :class="'user-grid-25'">{{userInfo.radProduct.name}}</a-card-grid>
      <a-card-grid :class="'user-grid-25'">套餐类型：</a-card-grid>
      <a-card-grid :class="'user-grid-25'">{{productTypes[userInfo.radProduct.type]}}</a-card-grid>
      <a-card-grid :class="'user-grid-25'">是否绑定Mac：</a-card-grid>
      <a-card-grid
        :class="'user-grid-25'"
      >{{userInfo.radProduct.shouldBindMacAddr == 1 ? '是' : '否'}}</a-card-grid>
      <a-card-grid :class="'user-grid-25'">是否绑定Vlan：</a-card-grid>
      <a-card-grid :class="'user-grid-25'">{{userInfo.radProduct.shouldBindVlan == 1 ? '是' : '否'}}</a-card-grid>
      <a-card-grid
        :class="'user-grid-25'"
      >{{userInfo.radProduct.type == 1 ? '月数' : (userInfo.radProduct.type == 2 ? '时长' : '流量')}}：</a-card-grid>
      <a-card-grid
        :class="'user-grid-25'"
      >{{userInfo.radProduct.type == 1 ? userInfo.radProduct.serviceMonth + '月' : (userInfo.radProduct.type == 2 ? userInfo.radProduct.productDuration / 60 +'分': userInfo.radProduct.productFlow / 1024 + 'M')}}</a-card-grid>
      <a-card-grid :class="'user-grid-25'">用户域：</a-card-grid>
      <a-card-grid :class="'user-grid-25'">{{userInfo.radProduct.domainCode}}</a-card-grid>
      <a-card-grid :class="'user-grid-25'">套餐并发数：</a-card-grid>
      <a-card-grid :class="'user-grid-25'">{{userInfo.radProduct.concurrentCount}}</a-card-grid>
      <a-card-grid :class="'user-grid-25'">上行限速(M)：</a-card-grid>
      <a-card-grid :class="'user-grid-25'">{{userInfo.radProduct.upStreamLimit / 1024}}</a-card-grid>
      <a-card-grid :class="'user-grid-25'">下行限速(M)：</a-card-grid>
      <a-card-grid :class="'user-grid-25'">{{userInfo.radProduct.downStreamLimit / 1024}}</a-card-grid>
    </a-card>
    <a-card title="订购记录" :style="{ marginTop: '10px' }">
      <template>
        <a-list :dataSource="listData">
          <a-list-item slot="renderItem" slot-scope="item">
            <a-card>
              <a-card-grid :class="'user-grid-50'">产品名称：</a-card-grid>
              <a-card-grid :style="productColor(item)" :class="'user-grid-50'">{{item.radProduct.name}}</a-card-grid>
              <a-card-grid :class="'user-grid-50'">订单时间：</a-card-grid>
              <a-card-grid :class="'user-grid-50'">{{item.userOrderRecord.orderTime}}</a-card-grid>
              <a-card-grid :class="'user-grid-50'">服务截止日期：</a-card-grid>
              <a-card-grid :class="'user-grid-50'">{{item.userOrderRecord.endDate.substring(0, 10)}}</a-card-grid>
              <a-card-grid :class="'user-grid-25'">费用：</a-card-grid>
              <a-card-grid :class="'user-grid-25'">{{item.userOrderRecord.price / 100.0}}元</a-card-grid>
              <a-card-grid :class="'user-grid-25'">状态：</a-card-grid>
              <a-card-grid :style="productColor(item)" :class="'user-grid-25'">{{orderStatus[item.userOrderRecord.status]}}</a-card-grid>
            </a-card>
           </a-list-item>
        </a-list>
      </template>
    </a-card>
  </div>
  
</template>

<script>
import userConstant from "./userConstant";

const orderStatus = {
   1: "预定",
   2: "使用中",
   3: "已取消",
   4: "服务截止",
}

export default {
    name: "userInfo",
    props: ["userInfo","userId"],
    data() {
        return {
            userStateList: userConstant.userStateList,
            userStates: userConstant.userStates,
            productTypes: userConstant.productTypes,
            listData: [],
            orderStatus
        }
    },
    methods:{
      productColor(item) {
        var status = item.userOrderRecord.status;
        if(status == 1) {
           return {color: '#009688'};
        } else if(status == 2) {
          return {color:'#0e7fd8'};
        } else if(status == 3) {
          return {color:'#ea9e65'};
        }
      }
    },
    mounted() {
      this.axios.post(this.CONFIG.apiUrl + "/user/order/record",{
          id: this.userInfo.radUser.id
        }).then(response => {
            this.listData = response.data.data;
        });
    },
    watch: {
      userId(value) {
        console.log(value);
        this.axios.post(this.CONFIG.apiUrl + "/user/order/record",{
          id: value
        }).then(response => {
            this.listData = response.data.data;
        });
      }
    },
}
</script>
