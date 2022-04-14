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
                <el-select v-model="queryList.brandId" placeholder="品牌" class="handle-select mr10">
                    <el-option v-for="item in brandList"
                               :key="item.id" :label="item.name" :value="item.id"
                    ></el-option>
                </el-select>
                <el-select v-model="queryList.categoryId" placeholder="分类" class="handle-select mr10">
                    <el-option v-for="item in categoryList"
                               :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-input v-model="queryList.name" placeholder="商品名" style="width: 200px" class="handle-input mr10"></el-input>
                <el-input v-model="queryList.keyword" placeholder="模糊关键字" style="width: 200px" class="handle-input mr10"></el-input>

                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="warning" icon="el-icon-brush" style="margin-right: 15px;" @click="handleResetSearch">
                    重置
                </el-button>
                <el-button type="danger" icon="el-icon-crop" style="float: right;margin-right: 15px;"
                           @click="handleAddProduct">添加
                </el-button>
            </el-card>

            <el-card class="mt30">
                <el-table :data="productList" border class="table" ref="multiTable" align="center"
                          header-cell-class-name="table-header">
                    <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
                    <el-table-column prop="name" label="商品名" width="150"></el-table-column>
                    <el-table-column prop="price" label="基础价格" align="center" width="150">
                        <template #default="scope">￥{{scope.row.price}}</template>
                    </el-table-column>
                    <el-table-column label="SKU库存" align="center" width="150">
                        <template #default="scope">
                            <el-button type="primary" icon="el-icon-edit"
                                       @click="handleShowSkuEditDialog( scope.row)" circle></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="销量" align="center" width="150">
                        <template #default="scope">{{scope.row.sales}}</template>
                    </el-table-column>
                    <el-table-column label="库存" align="center" width="150">
                        <template #default="scope">
                            <el-tag :type="scope.row.status === 0
                            ? 'success'
                            :scope.row.status === 1
                            ? 'danger'
                            :scope.row.status === 2
                            ? 'warning'
                            : ''">{{scope.row.status === 0
                                ? '有货'
                                :scope.row.status === 1
                                ? '无货'
                                :scope.row.status === 2
                                ? '即将无货'
                                : ''}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template #default="scope">
                            <p>
                                <el-button
                                        @click="handleUpdateProduct(scope.$index, scope.row)">编辑
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

        </div>

        <el-dialog
                title="编辑货品信息"
                v-model="skuList.dialogVisible"
                width="40%">
            <span>商品名称：</span>
            <span>{{skuList.productName}}</span>
            <el-table style="width: 100%;margin-top: 20px"
                      :data="skuList.skus"
                      border>
                <el-table-column
                        label="SKU编号"
                        align="center">
                    <template #default="scope">
                        {{scope.row.id}}
                    </template>
                </el-table-column>
                <el-table-column
                        v-for="(item,index) in skuList.attrs"
                        :label="item.name"
                        :key="item.id"
                        align="center">
                    <template #default="scope">
                        {{getProductSkuSp(scope.row,index,item.name)}}
                    </template>
                </el-table-column>
                <el-table-column
                        label="销售价格"
                        width="80"
                        align="center">
                    <template #default="scope">
                        <el-input v-model="scope.row.price"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                        label="商品库存"
                        width="80"
                        align="center">
                    <template #default="scope">
                        <el-input v-model="scope.row.stock"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center">
                    <template #default="scope">
                        <el-button type="danger" @click="handleDeleteSku(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="skuList.dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
                 </span>
            </template>
        </el-dialog>


    </div>
</template>

<script>
    import {ref, reactive, onMounted} from "vue";
    //import {ElMessage} from 'element-plus';
    import {
        getProductList,
        updateProduct,
        getProductsByCondition,
        addProduct, deleteProduct
    } from "../api/product";
    import {getSkuList, deleteSku, updateSkus} from "../api/sku";
    import {getAttrList} from "../api/attr";
    import {getBrands} from "../api/brand";
    import {getCategories, getCateById} from "../api/category";
    import {useRouter} from "vue-router";

    const defaultQueryList = {
        keyword: null,
        pageNum: 1,
        pageSize: 5,
        productId: null,
        brandId: null,
        categoryId: null,
        name: null
    }

    export default {
        name: "ProductList",

        data() {
            return {
                productList: [],
                brandList: [],
                categoryList: [],
                skuList: {
                    id: null,
                    dialogVisible: false,
                    productName: null,
                    skuId: null,
                    attrIds: null,
                    skus: [],
                    attrs: [],
                },
                queryList: {
                    keyWord: null,
                    pageNum: 1,
                    pageSize: 5,
                    brandId: null,
                    categoryId: null,
                    name: null
                },
                total: null,
            }
        },
        created() {
            this.getProductList();
            this.getBrandsAndCategories();
        },
        methods: {

            getProductList() {
                getProductList({pageNum:this.queryList.pageNum,pageSize:this.queryList.pageSize}).then(res => {
                    this.productList = res.list;
                    this.total = res.total;
                    //console.log(res)
                })

            },

            getBrandsAndCategories() {
                getBrands().then(res => {
                    //console.log(res)
                    this.brandList = res
                })
                getCategories().then(res => {
                    //console.log(res)
                    this.categoryList = res
                })
            },

            getProductSkuSp(row, index) {
                let spData = JSON.parse(row.spData);
                if (spData != null && index < spData.length) {
                    //console.log(spData[index].value)
                    return spData[index].value;
                } else {
                    return null;
                }
            },

            handleSearch() {
                //console.log(this.queryList)
                getProductsByCondition(this.queryList)
                    .then(res => {
                        this.productList = res.list
                    })
            },

            handleDeleteSku(id) {
                this.$confirm('是否要进行删除操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteSku(id).then(res => {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.handleShowSkuEditDialog(this.skuList)
                    });
                })
            },

            handleResetSearch() {
                this.queryList = Object.assign({}, defaultQueryList);
            },

            handleUpdateProduct(index, row) {
                const id = row.id
                this.$router.push({path: '/updateProduct', query: {id}})
            },

            handleAddProduct() {
                this.$router.push({path: '/add'})
            },

            handleShowSkuEditDialog(row) {
                this.skuList.dialogVisible = true;
                this.skuList.attrIds = row.attrIds;
                this.skuList.id = row.id;
                this.skuList.productName = row.name;
                getSkuList(row.id).then(res => {
                    this.skuList.skus = res
                })

                getCateById(row.categoryId).then(res => {
                    getAttrList({ids: res.attrIds}).then(res => {
                        this.skuList.attrs = res
                    })
                })
            },

            handleEditSkuConfirm() {
                if (this.skuList.skus == null || this.skuList.skus.length <= 0) {
                    this.$message({
                        message: '暂无sku信息',
                        type: 'warning',
                        duration: 1000
                    });
                    return
                }
                this.$confirm('是否要进行修改', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateSkus(this.skuList.skus).then(response => {
                        this.$message({
                            message: '修改成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.skuList.dialogVisible = false;
                        this.getProductList();
                    });
                });
            },
            handleSizeChange(val) {
                this.queryList.pageNum = 1;
                this.queryList.pageSize = val;
                this.getProductList();
            },
            handleCurrentChange(val) {
                this.queryList.pageNum = val;
                console.log(this.queryList.pageNum)
                this.getProductList();
            },

            handleDelete(index, row) {
                this.$confirm('是否要进行删除操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteProduct(row.id).then(res => {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.getProductList();
                    });

                })
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 10px;
    }

    .handle-select {
        width: 120px;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }



</style>
