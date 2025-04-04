import { ShoppingCart, RefreshCw, CreditCard, MapPin, Calendar, Users, Tag } from "lucide-react"

type CategoryIconProps = {
  category: string
  className?: string
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  switch (category) {
    case "purchase":
      return <ShoppingCart className={className} />
    case "renewals":
      return <RefreshCw className={className} />
    case "bill-payments":
      return <CreditCard className={className} />
    case "outings":
      return <MapPin className={className} />
    case "routines":
      return <Calendar className={className} />
    case "family-time":
      return <Users className={className} />
    default:
      return <Tag className={className} />
  }
}

