<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { CourseCategoryComposible } from './composible/index';
import { message } from 'ant-design-vue';
import type { ICatgoryEntity } from './entity/category.entity';
import type { IFormStateCategory } from './interface/category.interface';
import type { IData } from './interface/data.interface';

    const { fetchAll, deleteItem, updateItem, createItem } = CourseCategoryComposible();

    const columns = [
        {
            title: 'No',
            dataIndex: 'id',
            key: 'no',
            width: '5%'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Action',
            key: 'action',
            width: '10%'
        },
    ]

    const data = reactive<IData>({
        categories: [],
        isLoading: false
    });

    const onDelete = async (id: number) => {
        try {
            await deleteItem(id);
            message.success('Customer deleted successfully');
            await fetchItems();
        } catch (err: unknown) {
            console.log(err);
        }
    }

    onMounted(async() => {
        await fetchItems();
    })

    const fetchItems = async () => {
        data.isLoading = true;
        const respone = await fetchAll();
        data.categories = respone.data;
        data.isLoading = false;
    }

    const open = ref(false)
    const formState = reactive<IFormStateCategory>({
        id: 0,
        name: ''
    })

    const handleEdit = async () => {
        try {
            await updateItem(formState)
            open.value = false;
            await fetchItems();
            await clearFormState();
        } catch (err: unknown) {
            console.log(err)
        }
    }

    const openModalEdit = (value: ICatgoryEntity) => {
        formState.id = value.id;
        formState.name = value.name;
        open.value = true;
    }

    const openModalAdd = ref(false)

    const createNew = async () => {
        openModalAdd.value = true;
    }

    const handleSubmit = async () => {
        try {
            await createItem(formState);
            await fetchItems();
            await clearFormState();
            openModalAdd.value = false;
        } catch (err: unknown) {
            console.log(err);
        }
    }

    const clearFormState = async () => {
        formState.id = 0;
        formState.name = '';
    }
</script>

<template>
    <div>   
        <div class="parent">
            <h2>List Course Categories</h2>
            <div>
                <a-button type="primary" @click="createNew">Create New</a-button>
            </div>
        </div>

        <!-- Table -->
        <a-table :dataSource="data.categories" :columns="columns" :loading="data.isLoading">
            <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'no'">
                   {{ index+1 }}
                </template>
                <template v-if="column.key === 'action'">
                    <a @click="openModalEdit(record)">Edit</a>
                    <a-divider type="vertical" />
                    <a-popconfirm
                        v-if="data.categories.length"
                        title="Sure to delete?"
                        @confirm="onDelete(record.id)"
                    >
                        <a style="color: red">Delete</a>
                    </a-popconfirm>
                </template>
            </template>
        </a-table>
        <!-- End Table -->

        <!-- Modal Update -->
        <a-modal v-model:open="open" title="Basic Modal" @ok="handleEdit">
            <a-input v-model:value="formState.name" />
        </a-modal>
        <!-- End Modal Update -->

        <!-- Modal Create -->
        <a-modal v-model:open="openModalAdd" title="Create Category" @ok="handleSubmit">
            <a-input v-model:value="formState.name" />
        </a-modal>
        <!-- End Modal Create -->
    </div>
</template>

<style lang="scss" scoped>
    .parent {
        display: flex;
        justify-content: space-between;
        padding: 20px;
    }
</style>