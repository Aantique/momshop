<template>
    <div>
        <el-row :gutter="20">

            <el-col>
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-user-solid grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">￥{{index.money}}</div>
                                    <div>今日收入</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-message-solid grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{index.orders}}</div>
                                    <div>今日订单</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-s-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">5000</div>
                                    <div>库存不足商品</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <!-- <el-card shadow="hover" style="height:403px;">
                     <template #header>
                         <div class="clearfix">
                             <span>订单明细</span>
                             <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
                         </div>
                     </template>

                     <el-table :show-header="false" :data="todoList" style="width:100%;">
                         <el-table-column width="40">
                             <template #default="scope">
                                 <el-checkbox v-model="scope.row.status"></el-checkbox>
                             </template>
                         </el-table-column>
                         <el-table-column>
                             <template #default="scope">
                                 <div class="todo-item" :class="{
                                         'todo-item-del': scope.row.status,
                                     }">{{ scope.row.title }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="60">
                            <template>
                                <i class="el-icon-edit"></i>
                                <i class="el-icon-delete"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>-->
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card>
                    <div style="margin-bottom: 20px;">
                        <i class="el-icon-tickets"></i>
                        <span>数据列表</span>
                        <el-button
                                type="danger"
                                style="float:right;"
                                @click="handleAddProduct"
                                size="mini">
                            添加
                        </el-button>
                    </div>
                    <el-table :data="state.tableData" border class="table" align="center">
                        <el-table-column prop="id" width="60" label="ID" align="center"></el-table-column>
                        <el-table-column prop="name" width="100" label="品牌名" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template #default="scope">
                                <p>
                                    <el-button size="mini"
                                               @click="handleUpdateBrand(scope.$index, scope.row)">编辑
                                    </el-button>
                                    <el-button size="mini"
                                               type="danger"
                                               @click="handleDelete(scope.$index, scope.row)">删除
                                    </el-button>
                                </p>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination-container">
                        <el-pagination
                                background
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                layout="total, sizes,prev, pager, next,jumper"
                                :page-size="state.pageSize"
                                :page-sizes="[5,10,15]"
                                :current-page.sync="state.pageNum"
                                :total="state.total">
                        </el-pagination>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card>
                    <el-table :data="products.data" border class="table" align="center">
                        <el-table-column prop="id" label="ID" align="center"></el-table-column>
                        <el-table-column label="商品名" width="150" align="center">
                            <template #default="scope">
                                <p>{{scope.row.productName}}</p>
                                <p>{{getSpData(scope.row.spData)}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额" align="center" width="100">
                            <template #default="scope">
                                ￥{{scope.row.amount}}
                            </template>
                        </el-table-column>
                        <el-table-column label="数量" align="center" prop="quantity" width="100"></el-table-column>
                        <el-table-column label="支付方式" align="center" width="150">
                            <template #default="scope">
                                <el-tag :type="scope.row.paymentMethod === 0
                            ? 'success'
                            :scope.row.paymentMethod === 1
                            ? 'danger'
                            : ''">{{scope.row.paymentMethod === 0
                                    ? '电子支付'
                                    :scope.row.paymentMethod === 1
                                    ? '现金'
                                    : ''}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="订单日期" align="center" prop="createTime" width="200"></el-table-column>
                    </el-table>
                    <div class="pagination-container">
                        <el-pagination
                                background
                                @size-change="handleSizeChange1"
                                @current-change="handleCurrentChange1"
                                layout="total, sizes,prev, pager, next,jumper"
                                :page-size="stateOrder.pageSize"
                                :page-sizes="[5,10,15]"
                                :current-page.sync="stateOrder.pageNum"
                                :total="products.total">
                        </el-pagination>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog
                title="编辑品牌信息"
                v-model="isEdit.dialogVisible"
                width="30%">
            <el-form :model="isEdit.data"
                     size="small" align="center">
                <el-form-item label="品牌名称">
                    <el-input style="width: 200px" v-model="isEdit.data.name"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="isEdit.dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleEditBrandConfirm">确 定</el-button>
                 </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import {reactive} from "@vue/reactivity";
    import {addBrand, deleteBrand, getBrandList, getBrands, updateBrand} from "../api/brand";
    import {onMounted} from "@vue/runtime-core";
    import {ElMessage, ElMessageBox} from "element-plus";
    import {getOrderList} from "../api/order";

    export default {
        name: "dashboard",
        setup() {
            const name = localStorage.getItem("ms_username");
            const role = name === "admin" ? "超级管理员" : "普通用户";
            const index = reactive({
                money: 0,
                orders: 0
            })
            const products = reactive(
                {
                    data: [],
                    total: 0
                }
            )
            const state = reactive({
                tableData: [], // 数据列表
                total: 0, // 总条数
                pageNum: 1, // 当前页
                pageSize: 5, // 分页大小
            })
            const stateOrder = reactive({
                name: null,
                time: null,
                pageNum: 1, // 当前页
                pageSize: 5, // 分页大小
            })
            const isEdit = reactive({
                is: false,
                dialogVisible: false,
                data: {}
            })

            onMounted(() => {
                getBrand()
                getOrder()
            })


            const getOrder = () => {
                stateOrder.time = []
                stateOrder.time.push(new Date().toLocaleDateString().replace(/\//g, "-")
                    + " " + "00:00:00")
                stateOrder.time.push(new Date().toLocaleDateString().replace(/\//g, "-")
                    + " " + "00:00:00")
                getOrderList(stateOrder).then(res => {
                    products.data = res.list
                    products.total = res.total
                    index.orders = res.list.length
                    for (let i = 0; i < res.list.length; i++) {
                        index.money = index.money + res.list[i].amount
                    }
                })
            }

            const getSpData = (data) => {
                let spData = JSON.parse(data);
                var attrs = "";
                //console.log(spData)
                for (let i = 0; i < spData.length; i++) {
                    attrs = attrs + " " + spData[i].value;
                }
                return attrs;
            }

            const getBrand = () => {
                getBrandList({pageNum: state.pageNum, pageSize: state.pageSize}).then(res => {
                    console.log(res)
                    state.total = res.total
                    state.tableData = res.list
                })
            }

            const handleAddProduct = () => {
                isEdit.is = false
                isEdit.dialogVisible = true
            }

            const handleUpdateBrand = (index, row) => {
                isEdit.is = true
                isEdit.data = row
                isEdit.dialogVisible = true
            }

            const handleDelete = (index, row) => {
                ElMessageBox.confirm('是否要删除品牌？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteBrand(row.id).then(res => {
                        ElMessage.success("删除成功");
                        getBrand()
                    })
                })
            }
            const handleEditBrandConfirm = () => {
                ElMessageBox.confirm('是否修改/添加？', '提示', {
                    type: 'warning'
                }).then(() => {
                    if (isEdit.is){
                        updateBrand(isEdit.data).then(res => {
                            ElMessage.success('修改成功')
                            getBrand()
                        })
                    }else {
                        addBrand(isEdit.data).then(res=>{
                            ElMessage.success('添加成功')
                            getBrand()
                        })
                    }

                    isEdit.dialogVisible=false

                })
            }
            const handleSizeChange1 = (val) => {
                stateOrder.pageNum = 1;
                stateOrder.pageSize = val;
                getOrder()
            }
            const handleCurrentChange1 = (val) => {
                stateOrder.pageNum = val;
                getOrder()
            }

            const handleSizeChange = (val) => {
                state.pageNum = 1;
                state.pageSize = val;
                getBrand()
            }
            const handleCurrentChange = (val) => {
                state.pageNum = val;
                getBrand()
            }

            return {
                name,
                state,
                stateOrder,
                role,
                products,
                index,
                handleCurrentChange,
                handleSizeChange,
                handleCurrentChange1,
                handleSizeChange1,
                handleDelete,
                handleUpdateBrand,
                handleEditBrandConfirm,
                handleAddProduct,
                getSpData,
                isEdit
            };
        },
    };
</script>

<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }
</style>
