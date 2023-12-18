<script setup lang="tsx">
import { PropType, ref } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { Icon } from '@/components/Icon'
import { ElTag } from 'element-plus'

defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => undefined
  }
})

const renderTag = (enable?: boolean) => {
  return <ElTag type={!enable ? 'danger' : 'success'}>{enable ? '启用' : '禁用'}</ElTag>
}

const detailSchema = ref<DescriptionsSchema[]>([
  {
    field: 'is_menu',
    label: '菜单类型',
    span: 24,
    slots: {
      default: (data) => {
        return <>{data.is_menu ? '菜单' : '目录'}</>
      }
    }
  },
  {
    field: 'parentName',
    label: '父级菜单'
  },
  {
    field: 'id',
    label: '菜单id'
  },
  {
    field: 'menu_title',
    label: '菜单名称'
  },
  {
    field: 'icon',
    label: '图标',
    slots: {
      default: (data) => {
        const icon = data.icon
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
  {
    field: 'component',
    label: '组件',
    slots: {
      default: (data) => {
        const component = data.component
        return <>{component === '#' ? '顶级目录' : component === '##' ? '子目录' : component}</>
      }
    }
  },
  {
    field: 'menu_name',
    label: '组件名称'
  },
  {
    field: 'frame_url',
    label: '外链路径'
  },
  {
    field: 'path',
    label: '路径'
  },
  {
    field: 'is_active',
    label: '菜单状态',
    slots: {
      default: (data) => {
        return renderTag(data.is_active)
      }
    }
  },
  {
    field: 'sort',
    label: '排序'
  },
  {
    field: 'is_cache',
    label: '页面缓存',
    slots: {
      default: (data) => {
        return renderTag(data.is_cache)
      }
    }
  },
  {
    field: 'is_show',
    label: '页面展示',
    slots: {
      default: (data) => {
        return renderTag(data.is_show)
      }
    }
  },
  {
    field: 'redirect',
    label: '重定向路由'
  }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
