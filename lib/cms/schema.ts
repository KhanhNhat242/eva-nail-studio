/**
 * Cấu hình CMS dùng chung client (dựng form) + server (validate trong Server Action).
 * Mỗi collection nội dung khai báo trường một lần ở đây; thêm trường mới = thêm 1 dòng.
 * KHÔNG import thứ gì chỉ chạy ở server vào file này.
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'money' // số nguyên đồng ≥ 0
  | 'moneyNullable'
  | 'int'
  | 'priceRange' // { min, max | null } | null
  | 'list' // string[]
  | 'select'
  | 'multiselect'
  | 'bool'
  | 'image' // đường dẫn /images/...
  | 'imageNullable'
  | 'pairs' // { id, label|name }[] — danh mục

export type OptionSource = 'priceCategories' | 'modelCategories' | 'courses'
export type FieldDef = {
  /** Đường dẫn trường, có thể lồng: "cta.label" */
  name: string
  label: string
  type: FieldType
  required?: boolean
  max?: number
  help?: string
  options?: OptionSource
  /** Tên khoá nhãn trong 'pairs' (mặc định "label") */
  pairLabelKey?: 'label' | 'name'
}

export type ContentCollection = 'service' | 'combo' | 'price' | 'model' | 'course' | 'achievement' | 'whyus'
export type SectionCollection =
  | 'service_section'
  | 'combo_section'
  | 'price_list'
  | 'model_section'
  | 'course_section'
  | 'achievement_section'
  | 'whyus_section'

export type EntityDef = {
  collection: ContentCollection
  section: SectionCollection
  /** Trường trong section chứa mảng id (thứ tự + hiển thị) */
  sectionKey: string
  slug: string
  label: string
  itemLabel: string
  /** Trường dùng làm tên item (và để tạo id khi thêm mới) */
  titleField: string
  /**
   * Số mục tối đa được hiển thị cùng lúc trên trang chủ (bố cục section cố định số thẻ). Không đặt = không giới hạn.
   * Đủ rồi thì muốn bật thêm phải tắt Hiển thị 1 mục khác; mục mới thêm khi đã đủ sẽ ở trạng thái ẩn.
   */
  maxVisible?: number
  fields: FieldDef[]
  sectionFields: FieldDef[]
  note?: string
}

const T = (name: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ name, label, type: 'text', max: 200, ...extra })
const TA = (name: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ name, label, type: 'textarea', max: 600, ...extra })

export const entities: EntityDef[] = [
  {
    collection: 'service',
    section: 'service_section',
    sectionKey: 'service',
    slug: 'dich-vu',
    maxVisible: 4,
    label: 'Dịch vụ',
    itemLabel: 'thẻ dịch vụ',
    titleField: 'title',
    note: 'Chồng thẻ cuộn ở đầu trang. Thẻ khóa học dùng "Chữ đè lên ảnh".',
    sectionFields: [T('title', 'Tiêu đề', { required: true }), TA('description', 'Mô tả', { required: true })],
    fields: [
      T('title', 'Tên thẻ', { required: true }),
      TA('description', 'Mô tả', { required: true }),
      { name: 'price', label: 'Giá', type: 'priceRange' },
      T('price_label', 'Nhãn giá', { help: 'Khi không có giá: chữ thay giá (vd. "Liên hệ tư vấn"). Khi có giá: tiền tố (vd. "Học phí từ").' }),
      { name: 'img', label: 'Ảnh', type: 'imageNullable' },
      T('img_alt', 'Mô tả ảnh (alt)'),
      T('cta.label', 'Chữ trên nút', { required: true, max: 40 }),
      T('cta.href', 'Nút dẫn tới', { required: true, help: 'Ví dụ #dat-lich, #khoa-hoc' }),
      T('overlay.kicker', 'Chữ đè lên ảnh – dòng nhỏ', { help: 'Để trống cả 2 dòng nếu không cần chữ đè.' }),
      T('overlay.heading', 'Chữ đè lên ảnh – dòng lớn'),
    ],
  },
  {
    collection: 'combo',
    section: 'combo_section',
    sectionKey: 'combo',
    slug: 'combo',
    maxVisible: 4,
    label: 'Hot combo',
    itemLabel: 'combo',
    titleField: 'title',
    sectionFields: [
      T('eyebrow', 'Nhãn nhỏ', { required: true }),
      T('title', 'Tiêu đề – dòng 1', { required: true }),
      T('title_highlight', 'Tiêu đề – dòng 2 (màu nhấn)'),
    ],
    fields: [
      T('title', 'Tên combo', { required: true }),
      TA('description', 'Bao gồm', { required: true }),
      { name: 'price', label: 'Giá (đồng)', type: 'money', required: true },
      { name: 'img', label: 'Ảnh minh họa', type: 'image', required: true },
      T('img_alt', 'Mô tả ảnh (alt)', { required: true }),
    ],
  },
  {
    collection: 'price',
    section: 'price_list',
    sectionKey: 'price',
    slug: 'bang-gia',
    label: 'Bảng giá',
    itemLabel: 'mục giá',
    titleField: 'name',
    note: 'Chuyên gel, không làm bột — không thêm dịch vụ bột/acrylic.',
    sectionFields: [{ name: 'categories', label: 'Danh mục (theo thứ tự hiển thị)', type: 'pairs', pairLabelKey: 'name', required: true }],
    fields: [
      T('name', 'Tên dịch vụ', { required: true }),
      { name: 'category', label: 'Danh mục', type: 'select', options: 'priceCategories', required: true },
      { name: 'price', label: 'Giá', type: 'priceRange' },
      T('unit', 'Đơn vị', { max: 20, help: 'Ví dụ "set". Để trống nếu không cần.' }),
      T('note', 'Ghi chú'),
    ],
  },
  {
    collection: 'model',
    section: 'model_section',
    sectionKey: 'model',
    slug: 'mau-nail',
    label: 'Mẫu nail',
    itemLabel: 'mẫu nail',
    titleField: 'name',
    note: 'Mẫu mới nhất đặt lên đầu danh sách. Đặt ảnh vào public/images/nails/ trước khi thêm mẫu.',
    sectionFields: [
      T('title', 'Tiêu đề', { required: true }),
      { name: 'categories', label: 'Nhóm lọc', type: 'pairs', pairLabelKey: 'label', required: true },
    ],
    fields: [
      T('name', 'Tên mẫu', { required: true }),
      T('code', 'Mã mẫu', { required: true, max: 20, help: 'Ví dụ EVA-09' }),
      { name: 'category', label: 'Nhóm', type: 'multiselect', options: 'modelCategories', required: true },
      { name: 'price', label: 'Giá từ (đồng)', type: 'money', required: true },
      { name: 'price_confirmed', label: 'Khách đã xác nhận giá', type: 'bool', help: 'Tắt = giá ước lượng (REQUIREMENTS mục 5).' },
      { name: 'img', label: 'Ảnh', type: 'image', required: true },
      T('img_alt', 'Mô tả ảnh (alt)', { required: true }),
      { name: 'img_width', label: 'Rộng ảnh (px)', type: 'int', required: true },
      { name: 'img_height', label: 'Cao ảnh (px)', type: 'int', required: true },
    ],
  },
  {
    collection: 'course',
    section: 'course_section',
    sectionKey: 'course',
    slug: 'khoa-hoc',
    maxVisible: 3,
    label: 'Khóa học',
    itemLabel: 'khóa học',
    titleField: 'name',
    note: 'Khóa đang ẩn vẫn có trong form đăng ký học (vd. gội dưỡng sinh). Không thêm đếm ngược / "chỉ còn X suất".',
    sectionFields: [
      T('eyebrow', 'Nhãn nhỏ', { required: true }),
      T('title', 'Tiêu đề', { required: true, help: 'Dạng "A – B – C": vế cuối xuống dòng trên màn rộng.' }),
      TA('description', 'Mô tả', { required: true }),
      { name: 'session', label: 'Ca học', type: 'list', required: true },
      { name: 'session_confirmed', label: 'Khách đã xác nhận ca học', type: 'bool' },
    ],
    fields: [
      T('name', 'Tên khóa', { required: true }),
      { name: 'price', label: 'Học phí (đồng)', type: 'money', required: true },
      { name: 'original_price', label: 'Giá gốc (gạch ngang)', type: 'moneyNullable' },
      TA('description', 'Mô tả', { required: true }),
      { name: 'commit', label: 'Điểm nổi bật', type: 'list', required: true },
      T('gift', 'Quà tặng'),
      { name: 'featured', label: 'Gói nổi bật (viền vàng)', type: 'bool' },
      { name: 'img', label: 'Ảnh bìa', type: 'imageNullable' },
      { name: 'img_placeholder', label: 'Ảnh bìa là ảnh minh họa', type: 'bool' },
    ],
  },
  {
    collection: 'achievement',
    section: 'achievement_section',
    sectionKey: 'achievement',
    slug: 'thanh-qua',
    maxVisible: 4,
    label: 'Thành quả học viên',
    itemLabel: 'thành quả',
    titleField: 'name',
    note: 'Chưa có ảnh học viên thật thì giữ "Ảnh minh họa" bật — không ghi ảnh mẫu tiệm là bài học viên.',
    sectionFields: [T('eyebrow', 'Nhãn nhỏ', { required: true }), T('title', 'Tiêu đề', { required: true }), TA('description', 'Mô tả', { required: true })],
    fields: [
      T('name', 'Tên bài thực hành', { required: true }),
      { name: 'course_id', label: 'Khóa học', type: 'select', options: 'courses', required: true },
      T('description', 'Tên khóa hiển thị', { required: true }),
      { name: 'placeholder', label: 'Ảnh minh họa (chưa phải bài học viên)', type: 'bool' },
      { name: 'img', label: 'Ảnh', type: 'image', required: true },
      T('img_alt', 'Mô tả ảnh (alt)', { required: true }),
    ],
  },
  {
    collection: 'whyus',
    section: 'whyus_section',
    sectionKey: 'whyus',
    slug: 'vi-sao',
    maxVisible: 7,
    label: 'Vì sao chọn Eva',
    itemLabel: 'lý do',
    titleField: 'title',
    note: 'Không dùng câu tự nhận không có dữ liệu ("được yêu thích nhất", "hàng nghìn học viên"…).',
    sectionFields: [T('eyebrow', 'Nhãn nhỏ', { required: true })],
    fields: [
      T('title', 'Tiêu đề', { required: true }),
      TA('description', 'Mô tả', { required: true }),
      T('tag', 'Nhãn ngắn', { required: true, max: 30 }),
      { name: 'img', label: 'Ảnh minh họa', type: 'image', required: true },
      { name: 'emphasis', label: 'Nhấn mạnh', type: 'bool' },
    ],
  },
]

export const entityBySlug = (slug: string) => entities.find((e) => e.slug === slug)
export const entityByCollection = (c: string) => entities.find((e) => e.collection === c)

// ---------- Truy cập trường lồng ----------

export function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj)
}

function setPath(obj: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split('.')
  let o = obj
  for (const k of keys.slice(0, -1)) {
    if (!o[k] || typeof o[k] !== 'object') o[k] = {}
    o = o[k] as Record<string, unknown>
  }
  o[keys[keys.length - 1]] = value
}

// ---------- Validate (chạy ở server; client chỉ dùng để gợi ý) ----------

/** Ảnh có sẵn trong public/images, hoặc ảnh tải lên từ CMS (/uploads/<tên>, xem lib/media.ts). */
export const IMAGE_PATH_RE = /^\/(images|uploads)\/[A-Za-z0-9/_.-]+\.(jpe?g|png|webp|avif)$/i

export type ValidationResult = { ok: true; value: Record<string, unknown> } | { ok: false; errors: Record<string, string> }

const isInt = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v)
const money = (v: unknown) => isInt(v) && v >= 0 && v <= 1_000_000_000

/** Chuẩn hoá + kiểm tra input theo danh sách trường; chỉ giữ các trường đã khai báo. */
export function validateFields(fields: FieldDef[], input: Record<string, unknown>, allowed: Partial<Record<OptionSource, string[]>> = {}): ValidationResult {
  const out: Record<string, unknown> = {}
  const errors: Record<string, string> = {}
  for (const f of fields) {
    const raw = getPath(input, f.name)
    const fail = (msg: string) => (errors[f.name] = msg)
    switch (f.type) {
      case 'text':
      case 'textarea':
      case 'image':
      case 'imageNullable': {
        const s = typeof raw === 'string' ? raw.trim() : ''
        if (!s) {
          if (f.required || f.type === 'image') fail(`Vui lòng nhập ${f.label.toLowerCase()}.`)
          setPath(out, f.name, null)
          break
        }
        if (f.max && s.length > f.max) fail(`Tối đa ${f.max} ký tự.`)
        if ((f.type === 'image' || f.type === 'imageNullable') && (!IMAGE_PATH_RE.test(s) || s.includes('..'))) fail('Chọn ảnh trong thư viện (/images/… hoặc ảnh đã tải lên).')
        setPath(out, f.name, s)
        break
      }
      case 'money':
        if (!money(raw)) fail('Nhập số tiền (đồng), ví dụ 129000.')
        setPath(out, f.name, raw)
        break
      case 'moneyNullable':
        if (raw === null || raw === undefined || raw === '') setPath(out, f.name, null)
        else if (!money(raw)) fail('Nhập số tiền (đồng) hoặc để trống.')
        else setPath(out, f.name, raw)
        break
      case 'int':
        if (!isInt(raw) || raw <= 0 || raw > 20000) fail('Nhập số nguyên dương.')
        setPath(out, f.name, raw)
        break
      case 'priceRange': {
        if (raw === null || raw === undefined) {
          setPath(out, f.name, null)
          break
        }
        const r = raw as { min?: unknown; max?: unknown }
        if (!money(r.min)) fail('Nhập giá thấp nhất (đồng).')
        else if (r.max !== null && r.max !== undefined && (!money(r.max) || (r.max as number) < (r.min as number))) fail('Giá cao nhất phải ≥ giá thấp nhất.')
        setPath(out, f.name, { min: r.min, max: r.max ?? null })
        break
      }
      case 'list': {
        const arr = Array.isArray(raw) ? raw.map((x) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean) : []
        if (f.required && arr.length === 0) fail('Cần ít nhất 1 dòng.')
        if (arr.some((x) => x.length > 200)) fail('Mỗi dòng tối đa 200 ký tự.')
        setPath(out, f.name, arr)
        break
      }
      case 'bool':
        setPath(out, f.name, raw === true)
        break
      case 'select': {
        const s = typeof raw === 'string' ? raw : ''
        const ok = f.options ? (allowed[f.options] ?? []).includes(s) : !!s
        if (!ok && (f.required || s)) fail(`Vui lòng chọn ${f.label.toLowerCase()}.`)
        setPath(out, f.name, s)
        break
      }
      case 'multiselect': {
        const arr = Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string') : []
        const valid = f.options ? arr.filter((x) => (allowed[f.options!] ?? []).includes(x)) : arr
        if (f.required && valid.length === 0) fail(`Chọn ít nhất 1 ${f.label.toLowerCase()}.`)
        setPath(out, f.name, valid)
        break
      }
      case 'pairs': {
        const key = f.pairLabelKey ?? 'label'
        const arr = Array.isArray(raw) ? raw : []
        const pairs = arr.map((p) => {
          const o = (p ?? {}) as Record<string, unknown>
          const label = typeof o[key] === 'string' ? (o[key] as string).trim() : ''
          const id = typeof o.id === 'string' && o.id.trim() ? o.id.trim() : slugify(label)
          return { id, [key]: label }
        })
        if (pairs.some((p) => !p[key] || !p.id)) fail('Mỗi danh mục cần có tên.')
        if (new Set(pairs.map((p) => p.id)).size !== pairs.length) fail('Tên danh mục bị trùng.')
        if (f.required && pairs.length === 0) fail('Cần ít nhất 1 danh mục.')
        setPath(out, f.name, pairs)
        break
      }
    }
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value: out }
}

/** "Mắt mèo lavender" → "mat-meo-lavender" */
export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}
