<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 商品列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-card>
                <el-input style="width: 200px" v-model="queryList.name" placeholder="商品名" class="mr10"></el-input>

                <el-date-picker
                        style="margin-right: 20px;"
                        v-model="queryList.time"
                        type="daterange"
                        unlink-panels
                        range-separator="To"
                        start-placeholder="Start date"
                        end-placeholder="End date"
                        :shortcuts="shortcuts"
                        placeholder="请选择时间">
                </el-date-picker>

                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="warning" icon="el-icon-brush" style="margin-right: 15px;" @click="handleResetSearch">
                    重置
                </el-button>
                <el-button type="danger" icon="el-icon-crop" style="float: right;margin-right: 15px;"
                           @click="handleAddOrder">添加
                </el-button>
            </el-card>

            <el-card class="mt30">
                <el-table :data="orderList" border class="table" align="center"
                          header-cell-class-name="table-header">
                    <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
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
                    <el-table-column label="支付方式" align="center" width="200">
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
                    <el-table-column label="操作" align="center">
                        <template #default="scope">
                            <p>
                                <el-button
                                        @click="handleUpdateOrder(scope.$index, scope.row)">编辑
                                </el-button>
                                <el-button
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
                            :page-size="queryList.pageSize"
                            :page-sizes="[5,10,15]"
                            :current-page.sync="queryList.pageNum"
                            :total="total">
                    </el-pagination>
                </div>
            </el-card>

            <el-dialog
                    title="编辑订单信息"
                    v-model="isEdit.dialogVisible"
                    width="40%">
                <el-form :model="isEdit.order"
                         size="small" align="center">
                    <el-form-item label="选择分类">
                        <el-select v-model="isEdit.order.categoryId" change="this.isEdit.categoryId" placeholder="分类"
                                   class="handle-select mr10">
                            <el-option v-for="item in categoryList"
                                       @click="handleGetProducts(item.id)"
                                       :key="item.id" :label="item.name" :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择商品">
                        <el-select v-model="isEdit.order.productId" placeholder="商品" class="handle-select mr10">
                            <el-option v-for="item in isEdit.products"
                                       @click="handleGetSkus(item.id)"
                                       :key="item.id" :label="item.name" :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择属性">
                        <el-select v-model="isEdit.order.skuId" placeholder="sku" class="handle-select mr10">
                            <el-option v-for="item in skuList"
                                       :key="item.id" :label="item.spData" :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数量&emsp;" prop="quantity">
                        <el-input style="width: 200px" v-model="isEdit.order.quantity"></el-input>
                    </el-form-item>
                    <el-form-item label="价格&emsp;" prop="amount">
                        <el-input style="width: 200px" v-model="isEdit.order.amount"></el-input>
                    </el-form-item>
                    <el-form-item label="支付方式">
                        <el-select v-model="isEdit.order.paymentMethod" placeholder="支付方式" class="handle-select mr10">
                            <el-option v-for="item in paymentMethod"
                                       :key="item.value" :label="item.label" :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注&emsp;">
                        <el-input style="width: 200px" v-model="isEdit.order.remark"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                <span class="dialog-footer">
                    <el-button @click="isEdit.dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleEditOrderConfirm">确 定</el-button>
                 </span>
                </template>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    import {addOrder, deleteOrder, getOrderList, updateOrder} from "../api/order";
    import {getSkuList, updateSkus} from "../api/sku";
    import {getCategories} from "../api/category";
    import {getProductList, updateProduct} from "../api/product";

    const defaultQueryList = {
        name: null,
        createTime: null,
        pageNum: 1,
        pageSize: 5
    }

    const paymentMethod = [
        {
            value: '0',
            label: '电子支付',
        },
        {
            value: '1',
            label: '现金',
        }
    ]

    const shortcuts = [
        {
            text: '上周',
            value: () => {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                return [start, end]
            },
        },
        {
            text: '上个月',
            value: () => {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                return [start, end]
            },
        },
        {
            text: '过去三个月',
            value: () => {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                return [start, end]
            },
        },
    ]

    export default {
        name: "Order",
        data() {
            return {
                isEdit: {
                    is: false,
                    dialogVisible: false,
                    order: {},
                    categoryId: null,
                    products: []
                },
                categoryList: [],
                productList: [],
                skuList: [],
                queryList: {
                    name: null,
                    time: null,
                    pageNum: 1,
                    pageSize: 5
                },
                total: null,
                orderList: [],
                paymentMethod: [],
                shortcuts: []
            }
        },

        created() {
            // console.log(this.paymentMethod)
            this.paymentMethod = paymentMethod;
            this.getOrderList();
        },

        methods: {
            getOrderList() {
                getOrderList(this.queryList).then(res => {
                    console.log(res)
                    this.orderList = res.list;
                    this.total = res.total
                })
            },
            getSpData(data) {
                let spData = JSON.parse(data);
                var attrs = "";
                //console.log(spData)
                for (let i = 0; i < spData.length; i++) {
                    attrs = attrs + " " + spData[i].value;
                }
                return attrs;
            },
            handleDelete(index, row) {
                this.$confirm('是否要删除订单？' +
                    'PS:删除操作将会被记录', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteOrder(row).then(response => {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.isEdit.dialogVisible = false;
                        this.getOrderList();
                    });
                });
            },
            handleAddOrder() {
                this.isEdit.dialogVisible = true;
                this.isEdit.order={};
                this.getCategoriesAndProducts();
            },
            handleUpdateOrder(index, row) {
                this.isEdit.is = true;
                this.getCategoriesAndProducts();
                this.isEdit.order = row;
                this.isEdit.dialogVisible = true;
            },
            handleGetSkus(id){
                getSkuList(id).then(res=> {
                    console.log(res)
                    this.skuList = res;
                })
            },

            getCategoriesAndProducts(){
                getCategories().then(res => {
                    this.categoryList = res;
                    getProductList({pageNum: 1, pageSize: 1000}).then(res => {
                        this.productList = res.list;
                        if (this.isEdit.is){
                            getSkuList(this.isEdit.order.productId).then(res=>{
                                console.log(res)
                                this.skuList = res;
                            })
                        }
                    })
                })
            },
            handleEditOrderConfirm() {
                this.$confirm('是否要修改/添加订单？' +
                    'PS:修改操作将会被记录', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.isEdit.order.createTime = new Date(this.isEdit.order.createTime)
                    if(this.isEdit.is){
                        updateOrder(this.isEdit.order).then(res=>{
                            this.$message({
                                message: '修改/添加成功',
                                type: 'success',
                                duration: 1000
                            })
                            this.getOrderList();
                        })
                    }else {
                        for(let i=0;i<this.isEdit.products.length;i++){
                            if (this.isEdit.products[i].id === this.isEdit.order.productId){
                                this.isEdit.order.productName = this.isEdit.products[i].name;
                            }
                        }
                        for(let i=0;i<this.skuList.length;i++){
                            if (this.skuList[i].id === this.isEdit.order.skuId){
                                this.isEdit.order.spData = this.skuList[i].spData;
                            }
                        }
                        addOrder(this.isEdit.order).then(res=>{
                            this.$message({
                                message: '修改/添加成功',
                                type: 'success',
                                duration: 1000
                            });
                            this.getOrderList();
                        })
                    }

                    this.isEdit.order={};
                    this.isEdit.products=[];
                    this.isEdit.attrs=[];
                    this.isEdit.is=false;
                    this.isEdit.dialogVisible=false;
                })
            },
            handleGetProducts(id) {
                this.isEdit.products = []
                for (let i = 0; i < this.productList.length; i++) {
                    if (id === this.productList[i].categoryId) {
                        this.isEdit.products.push(this.productList[i])
                        //console.log(this.isEdit.products)
                    }
                }
            },

            handleSearch() {
                if (this.queryList.time!=null){
                    for (let i = 0; i < this.queryList.time.length; i++) {
                        this.queryList.time[i]
                            = new Date(this.queryList.time[i]).toLocaleDateString().replace(/\//g, "-")
                            + " " + new Date(this.queryList.time[i]).toTimeString().substr(0, 8)
                    }
                }
               // console.log(this.queryList)
                getOrderList(this.queryList).then(res => {
                    this.orderList = res.list;
                    this.total = res.total;
                })
            },
            handleResetSearch() {
                this.queryList = Object.assign({}, defaultQueryList);
            },
            handleSizeChange(val) {
                this.queryList.pageNum = 1;
                this.queryList.pageSize = val;
                this.getOrderList();
            },
            handleCurrentChange(val) {
                this.queryList.pageNum = val;
                this.getOrderList();
            },
        }
    }


</script>

<style scoped>
    .mr10 {
        margin-right: 10px;
    }
</style>
