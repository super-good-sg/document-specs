# Design: screens and components

Snapshot of [super-good.pen](super-good.pen) (Pencil, file version 2.21), copied from the owner's local design file for SIE-20. Names are exactly as in the file, including placeholder ones such as `iPhone 16 - 6`. Re-export this list when the .pen changes. Images the .pen references are in [images/](images/); remote Unsplash images stay remote.

## Screens (58)

Top-level frames that are not reusable components, not the `Components` sheet, and not the five section-divider bars (under 100 px tall), in file order.

| # | Name | Frame ID | Size |
|---|---|---|---|
| 1 | Splash screen | `Hd7KW` | 393 x 852 |
| 2 | On boarding 1 | `IbDax` | 393 x 852 |
| 3 | On boarding 2 | `GY1rW` | 393 x 852 |
| 4 | On boarding 3 | `jgM9D` | 393 x 852 |
| 5 | Sign-in | `f8gNwW` | 393 x 852 |
| 6 | Sign-up | `toU1O` | 393 x 852 |
| 7 | iPhone 16 - 6 | `sWZaX` | 393 x 852 |
| 8 | Iphone 16: review document: 1 document | `gaBva` | 393 x 852 |
| 9 | iPhone 16 - review document many | `euJh5` | 393 x 852 |
| 10 | iPhone 16 - image processing | `sBmDL` | 393 x 852 |
| 11 | iPhone 16 - process done | `ubv2a` | 393 x 852 |
| 12 | iPhone 16 - process fail | `oc8Pg` | 393 x 852 |
| 13 | iPhone 16 - 8 | `RlTOp` | 393 x 852 |
| 14 | iPhone 16 - 7 | `ujIUo` | 393 x 852 |
| 15 | iPhone 16 - 4 | `aOlRg` | 393 x 852 |
| 16 | iPhone 16 - 25 | `vJJXI` | 393 x 852 |
| 17 | iPhone 16 - order detail | `jOVeX` | 393 x 852 |
| 18 | iPhone 16 - order details button detail | `O9vMcT` | 393 x 852 |
| 19 | Contact list | `oJjk0` | 393 x 852 |
| 20 | Contact detail | `i8sBV` | 393 x 852 |
| 21 | iPhone 16 - ticket products list | `Nq2jb` | 393 x 852 |
| 22 | iPhone 16 - start recording | `WkQkS` | 393 x 852 |
| 23 | iPhone 16 - recording | `JMNbA` | 393 x 852 |
| 24 | iPhone 16 - record processing | `tTqKG` | 393 x 852 |
| 25 | iPhone 16 - record result | `px30H` | 393 x 852 |
| 26 | iPhone 16 - record result (swipe to remove) | `Vfnum` | 393 x auto |
| 27 | iPhone 16 - record result (remove confirm) | `Ybmor` | 393 x 852 |
| 28 | iPhone 16 - record result (edit item) | `t9Y2eL` | 393 x 852 |
| 29 | iPhone 16 - record result (hold to select) | `MdCD0` | 393 x 852 |
| 30 | iPhone 16 - record result (no selection) | `PAebm` | 393 x 852 |
| 31 | iPhone 16 - 4 (remove confirm) | `jHeeK` | 393 x 852 |
| 32 | iPhone 16 - Product list | `jgti3` | 393 x 852 |
| 33 | iPhone 16 - Product list (single sheet) (edit item) | `L8Owf` | 393 x 852 |
| 34 | iPhone 16 - record result (scroll) | `H8u8m` | 393 x 852 |
| 35 | iPhone 16 - Order pre creation | `SVuBo` | 393 x 852 |
| 36 | iPhone 16 - Product list | `mkPdU` | 393 x 852 |
| 37 | Contact list (edit contact) | `p1Tar` | 393 x 852 |
| 38 | Contact list (remove confirm) | `QpQEi` | 393 x 852 |
| 39 | Contact list (select many) | `Ghiw0` | 393 x 852 |
| 40 | iPhone 16 - Order list | `DDFAw` | 393 x 852 |
| 41 | iPhone 16 - Order list (swipe to remove) | `yR4Yn` | 393 x 852 |
| 42 | iPhone 16 - Order list (remove confirm) | `ZtLzU` | 393 x 852 |
| 43 | iPhone 16 - Order list (select many) | `sAuc0` | 393 x 852 |
| 44 | iPhone 16 - Order list (no results) | `Xuc9h` | 393 x 852 |
| 45 | iPhone 16 - Product detail (in stock) | `t6ZHn` | 393 x 852 |
| 46 | iPhone 16 - Product detail (zero amount) | `jXs1x` | 393 x 852 |
| 47 | iPhone 16 - Product detail (negative amount) | `TyyKH` | 393 x 852 |
| 48 | iPhone 16 - Product detail (price history) | `xZ9wb` | 393 x 852 |
| 49 | iPhone 16 - Product detail (unit pcs) | `yU4gh` | 393 x 852 |
| 50 | iPhone 16 - Product detail (select unit) | `n2ksq` | 393 x 852 |
| 51 | iPhone 16 - Product catalog list | `fSs9y` | 393 x 852 |
| 52 | Dashboard | `XG8h6` | 1440 x 1024 |
| 53 | Dashboard Mobile | `tArsM` | 393 x 852 |
| 54 | Dashboard Mobile - Menu | `iOPAC` | 393 x 852 |
| 55 | Setup 1 - Business | `wmaw4` | 393 x 852 |
| 56 | Setup 2 - Add orders | `YPWYj` | 393 x 852 |
| 57 | Setup 3 - Permissions | `X7755Z` | 393 x 852 |
| 58 | First Dashboard - Empty | `Ve7uC` | 393 x 852 |

## Components (127)

Every node marked reusable, at any depth, in file order.

- Title Pill
- Icon Button
- Segmented Tabs
- Count Pill
- Product Card
- Amount Card
- Form Card
- Product Row
- History Row
- Detail Row
- Transcribed Row
- Input Field
- Action Bar
- Primary Button
- Option Row Selected
- Option Row
- Notification
- Chip
- Search Bar
- Filter Chip
- Filter Chip Active
- Dropdown Chip
- Section Header
- Item Row
- Hint Row
- Loading Row
- Swipe Row
- Total Bar
- List Card
- Total Footer
- Sticky Footer
- Summary Row
- Summary Footer
- Customer Card
- Dialog Button Secondary
- Dialog Button Destructive
- Dialog Button Primary
- Filled Field
- Mic Halo
- Mic Halo Recording
- Mic Halo Processing
- Recording Status
- Sheet Header
- Divider Row
- Upload Button
- Stop Button
- Voice Sheet
- Voice Sheet Recording
- Voice Sheet Processing
- Title Header
- Header With Actions
- Selection Bar
- Transcribed Row Selected
- Remove Button
- Sticky Footer Remove
- Swipe Left Row
- Swipe Right Row
- Scan Title Pill
- Scan Hint
- Scan Frame
- Document Preview Card
- Camera Round Button
- Shutter
- Shutter Next
- Confirm Round Button
- Camera Controls Review
- Camera Controls
- Receipt Header
- Receipt Row
- Receipt Line
- Receipt Total
- Order Info Card
- Receipt Sheet
- Order Summary Card
- Contact Field
- Switch
- Tax Card
- Action Footer
- Status Card
- Status Card Failed
- Progress Bar
- Status Card Processing
- Document Carousel
- List Title Bar
- Status Filter Chip
- Status Filter Chip Active
- Order Row
- Order Row Selected
- Order Swipe Row
- Empty State Card
- New Order Footer
- Catalog Row
- Catalog Row Swatch
- Price History Row
- Contact Swipe Row
- Contact Swipe Row Selected
- Contact Edit Dialog
- Profile Card
- Contact Info Card
- Recent Orders Card
- Order Header Card
- Order Customer Card
- Order Items Sheet
- Options Menu
- Brand Logo
- Onboarding Actions
- Onboarding Actions Auth
- Onboarding Text
- Page Dots
- Auth Tabs
- Welcome Header
- Social Buttons
- Auth Divider
- Forgot Row
- Password Rules
- Terms Text
- Terms Row
- Bottom Sheet
- Confirm Dialog
- Edit Dialog
- Nav Item
- Nav Item Active
- Sidebar Menu
- KPI Card
- Setup Header
- Setup Option
- Setup Option Selected
