<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 商品分类
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-card class="operate-container">
                <i class="el-icon-tickets"></i>
                <span>数据列表</span>
                <el-button type="danger" icon="el-icon-crop" class="btn-add" style="margin-bottom: 20px;"
                           @click="handleAddCategory">添加
                </el-button>
            </el-card>
            <el-card class="mt30">
                <el-table :data="categoryList" border class="table" ref="multiTable" align="center"
                          header-cell-class-name="table-header">
                    <el-table-column prop="id" label="ID" align="center"></el-table-column>
                    <el-table-column prop="name" label="分类名" align="center"></el-table-column>
                    <el-table-column prop="attrs.length" label="分类属性" align="center"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template #default="scope">
                            <p>
                                <el-button
                                        @click="handleUpdateCategory(scope.$index, scope.row)">编辑
                                </el-button>
                                <el-button
                                        type="danger"
                                        @click="handleDeleteCategory(scope.$index, scope.row)">删除
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
                title="编辑分类信息"
                v-model="isEdit.dialogVisible"
                width="40%">
            <el-form :model="isEdit.category" ref="categoryInfoForm"
                     size="small">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="isEdit.category.name"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleAddAttrs">添加属性</el-button>
                    <!--<el-button type="danger" @click="handleSelectAttrs">从已有属性中添加</el-button>-->
                </el-form-item>

                <el-form-item>
                    <el-table
                            :data="isEdit.attrs"
                            border>
                        <el-table-column
                                width="80"
                                label="属性编号"
                                align="center">
                            <template #default="scope">
                                {{scope.row.id}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="属性名称"
                                width="80"
                                align="center">
                            <template #default="scope">
                                <el-input v-model="scope.row.name"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="属性内容"
                                align="center">
                            <template #default="scope">
                                <el-input v-model="scope.row.inputList"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item>
                    <el-form-item align="center">
                        <div style="margin: 20px">
                            <el-button @click="isEdit.dialogVisible=false" style="margin-right: 30px;">取消</el-button>
                            <el-button type="primary" @click="handleEditCateConfirm">完成</el-button>
                        </div>
                    </el-form-item>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>

    import {addCateAndAttr, deleteCateById, getCategoriesByPage, updateCateById} from "../api/category";
    import {deleteSku} from "../api/sku";
    import {getAttrList, updateAttrs} from "../api/attr";

    export default {
        name: "Category",
        data() {
            return {
                categoryList: [],
                queryList: {
                    pageNum: 1,
                    pageSize: 5
                },
                total: null,
                isEdit: {
                    is: false,
                    dialogVisible: false,
                    category: {},
                    attrs: []
                },
                /*rules: {
                    name: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'},
                        {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
                    ],
                }*/
            }
        },

        created() {
            this.getCategories();
        },

        methods: {
            getCategories() {
                getCategoriesByPage({pageNum: this.queryList.pageNum, pageSize: this.queryList.pageSize}).then(res => {
                    //console.log(res)
                    this.categoryList = res.list;
                    this.total = res.total;
                    for (let i = 0; i < res.list.length; i++) {
                        this.categoryList[i].attrs = res.list[i].attrIds.split(",")
                    }
                })
            },
            handleEditCateConfirm() {
                this.$confirm('是否要进行修改/添加操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    for (let i = 0; i < this.isEdit.attrs.length; i++) {
                        this.isEdit.attrs[i].inputList = this.isEdit.attrs[i].inputList.toString();
                    }
                    //this.isEdit.editCategory.attrs = this.isEdit.editCategory.attrs.toString();
                    //console.log(this.isEdit)
                    if (this.isEdit.is){
                        this.updateCate(this.isEdit);
                    }else {
                        this.addCate(this.isEdit);
                    }

                })
            },

            addCate(data){
                addCateAndAttr(data).then(res => {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.isEdit.dialogVisible = false;
                    this.getCategories();
                })
            },

            updateCate(data){
                updateCateById(data).then(res => {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.isEdit.dialogVisible = false;
                    this.getCategories();
                })
            },
            handleAddCategory() {
                this.isEdit.dialogVisible = true;
                this.isEdit.category.id=null;
                this.isEdit.category.name=null;
                this.isEdit.category.attrIds=null;
                this.isEdit.attrs=[];
            },

            handleAddAttrs() {
                this.isEdit.attrs.push({
                    id: null,
                    name: null,
                    inputList: null,
                })
            },
            handleSelectAttrs() {
                //this.isEdit.dialogVisible = true;
            },
            handleDeleteCategory(index, row) {
                this.$confirm('是否要进行删除操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteCateById(row.id).then(res => {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.getCategories();
                    });
                })
            },
            handleUpdateCategory(index, row) {
                this.isEdit.dialogVisible = true;
                this.isEdit.is=true;
                this.isEdit.category.id = this.categoryList[index].id;
                this.isEdit.category.name = this.categoryList[index].name;
                this.isEdit.category.attrIds = this.categoryList[index].attrIds;
                console.log(this.categoryList[index])
                getAttrList({ids: this.categoryList[index].attrIds}).then(res => {
                    this.isEdit.attrs = res
                    //console.log(this.isEdit.attrs)
                })
            },
            handleSizeChange(val) {
                this.queryList.pageNum = 1;
                this.queryList.pageSize = val;
                this.getCategories();
            },
            handleCurrentChange(val) {
                this.queryList.pageNum = val;
                this.getCategories();
            },
        }
    }
</script>

<style scoped>

</style>
