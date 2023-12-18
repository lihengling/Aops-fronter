<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { createMenuApi, deleteMenuApi, getMenuListApi, updateMenuApi } from '@/api/menu'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElButton, ElTag, ElMessage, ElMessageBox } from 'element-plus'
import { Icon } from '@/components/Icon'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await getMenuListApi(searchParams.value)
    return {
      list: res.data || []
    }
  }
})

const { dataList, loading } = tableState
const { getList } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'id',
    label: t('userDemo.index'),
    type: 'id'
  },
  {
    field: 'menu_title',
    label: t('menu.menuName'),
    slots: {
      default: (data: any) => {
        const title = data.row.menu_title
        return <>{title}</>
      }
    }
  },
  {
    field: 'icon',
    label: t('menu.icon'),
    slots: {
      default: (data: any) => {
        const icon = data.row.icon
        if (icon) {
          return (
            <>
              <Icon icon={icon} />
            </>
          )
        } else {
          return null
        }
      }
    }
  },
  // {
  //   field: 'meta.permission',
  //   label: t('menu.permission'),
  //   slots: {
  //     default: (data: any) => {
  //       const permission = data.row.meta.permission
  //       return permission ? <>{permission.join(', ')}</> : null
  //     }
  //   }
  // },
  {
    field: 'component',
    label: t('menu.component'),
    slots: {
      default: (data: any) => {
        const component = data.row.component
        return <>{component === '#' ? '顶级目录' : component === '##' ? '子目录' : component}</>
      }
    }
  },
  {
    field: 'path',
    label: t('menu.path')
  },
  {
    field: 'is_show',
    label: t('menu.status'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElTag type={data.row.is_show ? 'success' : 'danger'}>
              {data.row.is_show ? t('userDemo.enable') : t('userDemo.disable')}
            </ElTag>
          </>
        )
      }
    }
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
            <ElButton type="danger" onClick={() => DeleteAction(row)}>
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

const DeleteAction = async (row: any) => {
  const confirmMsg = `是否删除${
    row.component.includes('#') ? '目录（目录下的子菜单都会删除）' : '菜单'
  } ${row.menu_title}`
  ElMessageBox.confirm(confirmMsg, 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await deleteMenuApi({ id: row.id })
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      getList()
    })
    .catch(() => {})
}

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    try {
      saveLoading.value = true
      if (actionType.value === 'edit') {
        await updateMenuApi(formData)
      } else {
        await createMenuApi(formData)
      }
      saveLoading.value = false
      dialogVisible.value = false
      ElMessage.success('操作成功')
      getList()
    } catch (error) {
      saveLoading.value = false
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
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :current-row="currentRow" />

    <Detail v-if="actionType === 'detail'" :current-row="currentRow" />

    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="saveLoading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>
