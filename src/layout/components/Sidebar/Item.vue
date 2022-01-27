<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    num: {
      type: Number,
      default: 0
    }
  },
  render(h, context) {
    const { icon, title, num } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }

    if (title) {
      if(num > 0) {
        vnodes.push(
          <span slot='title'>
            {(title)}
            <span style='color: rgb(255, 196, 86)'> ({(num)})</span>
          </span>
        )
      }
      else
        vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
