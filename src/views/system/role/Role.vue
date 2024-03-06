<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { createRoleApi, getRoleListApi } from '@/api/role'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElButton, ElTag } from 'element-plus'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { updateRoleApi, deleteRoleApi } from '@/api/role'

const { t } = useI18n()

const ids = ref<string[]>([])

const delLoading = ref(false)

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getRoleListApi(
      {
        pageIndex: unref(currentPage),
        pageSize: unref(pageSize)
      },
      searchParams.value
    )
    return {
      list: res.data || [],
      total: res.total
    }
  },
  fetchDelApi: async () => {
    const results: boolean[] = [] // 存储删除结果的数组

    for (var id in unref(ids)) {
      const currentId = parseInt(unref(ids)[id])
      const res = await deleteRoleApi({ id: currentId })
      results.push(!!res) // 将删除结果添加到数组中
    }

    const allDeleted = results.every((result) => result) // 判断数组中的所有结果是否都为真（删除成功）
    return allDeleted
  }
})

const { dataList, loading, total } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'id',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'name',
    label: '角色标识'
  },
  {
    field: 'role_name',
    label: t('role.roleName')
  },
  {
    field: 'is_admin',
    label: '是否管理员',
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElTag type={data.row.is_admin ? 'success' : 'danger'}>
              {data.row.is_admin ? '是' : '否'}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'is_active',
    label: t('menu.status'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElTag type={data.row.is_active ? 'success' : 'danger'}>
              {data.row.is_active ? t('userDemo.enable') : t('userDemo.disable')}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'description',
    label: t('userDemo.remark')
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: 240,
    slots: {
      default: (data: any) => {
        const row = data.row
        return (
          <>
            <ElButton type="primary" onClick={() => action(row, 'edit')}>
              {t('exampleDemo.edit')}
            </ElButton>
            <ElButton type="success" onClick={() => action(row, 'detail')}>
              {t('exampleDemo.detail')}
            </ElButton>
            <ElButton type="danger" onClick={() => delData(data.row)}>
              {t('exampleDemo.del')}
            </ElButton>
          </>
        )
      }
    }
  }
])

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'query',
    label: t('common.searchLable'),
    component: 'Input'
  }
])

const searchParams = ref({})
const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref()
const actionType = ref('')

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const action = (row: any, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}

const delData = async (row: RoleBase | null) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row ? [row.id] : elTableExpose?.getSelectionRows().map((v: RoleBase) => v.id) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    let res
    if (actionType.value === 'edit') {
      res = await updateRoleApi(formData)
        .catch(() => {})
        .finally(() => {
          saveLoading.value = false
        })
      // 新增
    } else {
      delete formData['id']
      res = await createRoleApi(formData)
        .catch(() => {})
        .finally(() => {
          saveLoading.value = false
        })
    }
    if (res) {
      dialogVisible.value = false
      getList()
    }
  }
}
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
    <div class="mb-10px">
      <ElButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</ElButton>
    </div>
    <Table
      :columns="tableColumns"
      default-expand-all
      node-key="id"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total
      }"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :current-row="currentRow" />
    <Detail v-else :current-row="currentRow" />

    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="saveLoading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>
