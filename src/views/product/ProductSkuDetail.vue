<template xmlns="http://www.w3.org/1999/html">
    <div style="margin-top: 50px;width: 60%;">
        <el-form :model="value" ref="productAttrForm" size="small">
            <el-form-item label="属性类型：">
                <el-select v-model="value.product.categoryId" placeholder="分类" style="float:left;" class="handle-select">
                    <el-option  @click="handleGetAttrs(categories)" v-for="item in categories"
                               :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-card shadow="never" class="cardBg">
                    <div v-for="(attr,idx) in attrs" style="margin: 20px 0">
                        <span style="float: left">{{attr.name}}:</span><br>
                        <el-checkbox-group v-model="selectAttrs[idx].inputList" style="margin: 20px 0">
                            <el-checkbox v-for="item in attr.inputList" :label="item" :key="item"
                                         class="littleMarginLeft"></el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-card>

                <div style="margin: 20px 0;float: left">
                    <el-button type="primary" @click="refreshList">刷新列表</el-button>
                    <!--<el-button type="warning" @click="syncList">同步价格</el-button>-->
                </div>

                <el-table style="margin-top: 20px"
                          :data="value.skus"
                          border>
                    <el-table-column
                            label="SKU编号"
                            align="center">
                        <template #default="scope">
                            {{scope.row.id}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            v-for="(item,index) in attrs"
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
                            <el-button type="danger" @click="handleRemoveProductSku(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <div style="margin: 20px">
                    <el-button @click="handlePrev" style="margin-right: 30px;">上一步</el-button>
                    <el-button type="primary" @click="handleFinishCommit">完成</el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {addOrUpdateSkus} from "../../api/sku";
    import {getAttrList} from "../../api/attr";
    import {useRoute} from "vue-router";
    import {getCategories} from "../../api/category";

    export default {
        name: "ProductSkuDetail",
        props: {
            value: {},
            isEdit: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                attrs: [],
                selectAttrs: [],
                categories: [],
            }
        },
        created() {
            this.getAttrAndSku();
        },

        methods: {
            getAttrAndSku() {
                getCategories().then(res => {
                    this.categories = res;
                    if (this.isEdit){
                        this.handleGetAttrs(res);
                    }
                })

            },

            handleGetAttrs(cate){
                for (let i = 0; i < cate.length; i++) {
                    if (cate[i].id === this.value.product.categoryId) {
                        console.log(this.categories[i])
                        getAttrList({ids: cate[i].attrIds}).then(res => {
                            this.attrs = res
                            for (let i = 0; i < res.length; i++) {
                                let inputList = []
                                //console.log(res[i].id)
                                this.selectAttrs.push({
                                    id: res[i].id,
                                    name: res[i].name,
                                    inputList: inputList,
                                })
                            }
                        })
                    }
                }
            },


            refreshList() {
                this.$confirm('刷新列表将导致sku信息重新生成，是否要刷新', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.getSelectAttrs();
                });
            },

            getSelectAttrs() {
                this.value.skus = [];
                let skus = this.value.skus;
                //console.log(this.value.product.id)
                if (this.selectAttrs.length === 1) {
                    let attr = this.selectAttrs[0];
                    for (let i = 0; i < attr.inputList.length; i++) {
                        skus.push({
                            spData: JSON.stringify([{key: attr.name, value: attr.inputList[i]}])
                        })
                    }
                } else if (this.selectAttrs.length === 2) {
                    console.log(this.selectAttrs)
                    let attr0 = this.selectAttrs[0];
                    let attr1 = this.selectAttrs[1];
                    for (let i = 0; i < attr0.inputList.length; i++) {
                        if (attr1.inputList.length === 0) {
                            skus.push({
                                productId: this.value.product.id,
                                spData: JSON.stringify([{key: attr0.name, value: attr0.inputList[i]}])
                            });
                            continue;
                        }
                        for (let j = 0; j < attr1.inputList.length; j++) {
                            let spData = [];
                            spData.push({key: attr0.name, value: attr0.inputList[i]});
                            spData.push({key: attr1.name, value: attr1.inputList[j]});
                            skus.push({
                                productId: this.value.product.id,
                                spData: JSON.stringify(spData)
                            });
                        }
                    }
                }
                //console.log(this.skuList.skus)
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

            handleFinishCommit() {
                //console.log(this.isEdit);
                this.$emit('finishCommit', this.isEdit);
            },

            handleRemoveProductSku(index, row) {
                let list = this.value.skus;
                if (list.length === 1) {
                    list.pop();
                } else {
                    list.splice(index, 1);
                }
            },

            handlePrev() {
                this.$emit('prevStep')
            },
        }
    }
</script>

<style scoped>
    .cardBg {
        background: #F8F9FC;
    }
</style>
