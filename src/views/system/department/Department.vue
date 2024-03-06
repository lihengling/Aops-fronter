<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElTag } from 'element-plus'
import { Table } from '@/components/Table'
import {
  getDepartmentListApi,
  updateDepartmentApi,
  deleteDepartmentApi,
  createDepartmentApi
} from '@/api/department'
import { useTable } from '@/hooks/web/useTable'
import { ref, unref, reactive } from 'vue'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { FormSchema } from '@/components/Form/src/types'

const { t } = useI18n()

const ids = ref<string[]>([])

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getDepartmentListApi(
      {
        pageIndex: unref(currentPage),
        pageSize: unref(pageSize)
      },
      searchParams.value
    )
    return {
      list: res.data,
      total: res.total
    }
  },
  fetchDelApi: async () => {
    const results: boolean[] = [] // 存储删除结果的数组

    for (var id in unref(ids)) {
      const currentId = parseInt(unref(ids)[id])
      const res = await deleteDepartmentApi({ id: currentId })
      results.push(!!res) // 将删除结果添加到数组中
    }

    const allDeleted = results.every((result) => result) // 判断数组中的所有结果是否都为真（删除成功）
    return allDeleted
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'query',
    label: t('common.searchLable'),
    component: 'Input'
  }
])
const searchParams = ref({})
const setSearchParams = (params: any) => {
  searchParams.value = params
  getList()
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'selection'
    }
  },
  {
    field: 'id',
    label: t('tableDemo.index'),
    type: 'id',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    }
  },
  {
    field: 'department_name',
    label: t('userDemo.departmentName'),
    form: {
      component: 'Input',
      componentProps: {
        nodeKey: 'department_name',
        props: {
          label: 'department_name'
        }
      }
    }
  },
  {
    field: 'parent_id',
    label: '部门层级',
    table: {
      slots: {
        default: (data: any) => {
          if (!data.row.parent_id) {
            return <>顶级部门</>
          } else if (data.row.parent_id && data.row.children) {
            return <>次级部门</>
          } else {
            return <>子级部门</>
          }
        }
      }
    },
    form: {
      component: 'TreeSelect',
      componentProps: {
        nodeKey: 'id',
        props: {
          label: 'department_name'
        },
        highlightCurrent: true,
        expandOnClickNode: false,
        checkStrictly: true,
        checkOnClickNode: true,
        clearable: true
      },
      optionApi: async () => {
        const res = await getDepartmentListApi()
        return res.data
      }
    },
    // 详情
    detail: {
      slots: {
        default: (data: any) => {
          if (!data.parent_id) {
            return <>顶级部门</>
          } else if (data.parent_id && data.children) {
            return <>次级部门</>
          } else {
            return <>子级部门</>
          }
        }
      }
    }
  },
  {
    field: 'is_active',
    label: t('userDemo.status'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          const status = data.row.is_active
          return (
            <>
              <ElTag type={status ? 'success' : 'danger'}>
                {status ? t('userDemo.enable') : t('userDemo.disable')}
              </ElTag>
            </>
          )
        }
      }
    },
    form: {
      component: 'Select',
      componentProps: {
        options: [
          {
            value: false,
            label: t('userDemo.disable')
          },
          {
            value: true,
            label: t('userDemo.enable')
          }
        ]
      }
    },
    detail: {
      slots: {
        default: (data: any) => {
          return (
            <>
              <ElTag type={data.is_active ? 'success' : 'danger'}>
                {data.is_active ? t('userDemo.enable') : t('userDemo.disable')}
              </ElTag>
            </>
          )
        }
      }
    }
  },
  {
    field: 'created_at',
    label: t('tableDemo.displayTime'),
    search: {
      hidden: true
    },
    form: {
      hidden: true
    }
  },
  {
    field: 'description',
    label: t('userDemo.remark'),
    search: {
      hidden: true
    },
    form: {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 5
      },
      colProps: {
        span: 24
      }
    },
    detail: {
      slots: {
        default: (data: any) => {
          return <>{data.description}</>
        }
      }
    }
  },
  {
    field: 'action',
    width: '260px',
    label: t('tableDemo.action'),
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          return (
            <>
              <ElButton type="primary" onClick={() => action(data.row, 'edit')}>
                {t('exampleDemo.edit')}
              </ElButton>
              <ElButton type="success" onClick={() => action(data.row, 'detail')}>
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
  }
])

// @ts-ignore
const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<DepartmentBase | null>(null)
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = null
  dialogVisible.value = true
  actionType.value = ''
}

const delLoading = ref(false)

const delData = async (row: DepartmentBase | null) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: DepartmentBase) => v.id) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const action = (row: DepartmentBase, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    delete formData['children']
    saveLoading.value = true
    let res
    // 编辑
    if (actionType.value === 'edit') {
      res = await updateDepartmentApi(formData)
        .catch(() => {})
        .finally(() => {
          saveLoading.value = false
        })
      // 新增
    } else {
      res = await createDepartmentApi(formData)
        .catch(() => {})
        .finally(() => {
          saveLoading.value = false
        })
    }
    if (res) {
      dialogVisible.value = false
      currentPage.value = 1
      getList()
    }
  }
}
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="mb-10px">
      <ElButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</ElButton>
      <ElButton :loading="delLoading" type="danger" @click="delData(null)">
        {{ t('exampleDemo.del') }}
      </ElButton>
    </div>

    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      :columns="allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total
      }"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :current-row="currentRow"
    />

    <Detail
      v-if="actionType === 'detail'"
      :detail-schema="allSchemas.detailSchema"
      :current-row="currentRow"
    />

    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="saveLoading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>
