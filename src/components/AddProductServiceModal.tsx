import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Wrench, 
  DollarSign, 
  Calculator, 
  Tag, 
  Barcode,
  Clock,
  Truck,
  Save,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';

interface AddProductServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PricingTier {
  id: string;
  name: string;
  minQuantity: number;
  price: number;
}

export function AddProductServiceModal({ isOpen, onClose }: AddProductServiceModalProps) {
  const [itemType, setItemType] = useState<'product' | 'service'>('product');
  const [itemData, setItemData] = useState({
    name: '',
    description: '',
    sku: '',
    category: '',
    
    // Pricing
    basePrice: '',
    costPrice: '',
    markup: '',
    taxable: true,
    
    // Product specific
    trackInventory: false,
    currentStock: '',
    minStockLevel: '',
    maxStockLevel: '',
    unit: 'each',
    weight: '',
    dimensions: '',
    
    // Service specific
    duration: '',
    laborRate: '',
    
    // General
    active: true,
    notes: '',
    tags: [] as string[]
  });

  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [newTag, setNewTag] = useState('');

  const categories = [
    'Materials',
    'Labor',
    'Equipment',
    'Consulting',
    'Installation',
    'Maintenance',
    'Design',
    'Software',
    'Hardware',
    'Other'
  ];

  const units = [
    'each',
    'hour',
    'day',
    'square foot',
    'linear foot',
    'cubic yard',
    'pound',
    'gallon',
    'box',
    'case'
  ];

  const addPricingTier = () => {
    const newTier: PricingTier = {
      id: Date.now().toString(),
      name: `Tier ${pricingTiers.length + 1}`,
      minQuantity: pricingTiers.length === 0 ? 1 : Math.max(...pricingTiers.map(t => t.minQuantity)) + 1,
      price: parseFloat(itemData.basePrice) || 0
    };
    setPricingTiers([...pricingTiers, newTier]);
  };

  const removePricingTier = (id: string) => {
    setPricingTiers(pricingTiers.filter(tier => tier.id !== id));
  };

  const updatePricingTier = (id: string, field: keyof PricingTier, value: string | number) => {
    setPricingTiers(pricingTiers.map(tier => 
      tier.id === id ? { ...tier, [field]: value } : tier
    ));
  };

  const addTag = () => {
    if (newTag.trim() && !itemData.tags.includes(newTag.trim())) {
      setItemData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setItemData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const calculateMarkup = () => {
    const basePrice = parseFloat(itemData.basePrice) || 0;
    const costPrice = parseFloat(itemData.costPrice) || 0;
    if (costPrice > 0) {
      const markup = ((basePrice - costPrice) / costPrice) * 100;
      setItemData(prev => ({ ...prev, markup: markup.toFixed(2) }));
    }
  };

  const calculatePriceFromMarkup = () => {
    const costPrice = parseFloat(itemData.costPrice) || 0;
    const markup = parseFloat(itemData.markup) || 0;
    if (costPrice > 0 && markup > 0) {
      const basePrice = costPrice * (1 + markup / 100);
      setItemData(prev => ({ ...prev, basePrice: basePrice.toFixed(2) }));
    }
  };

  const handleSave = () => {
    console.log('Saving item:', { itemType, itemData, pricingTiers });
    // In a real app, this would save to the backend
    onClose();
    // Reset form
    setItemData({
      name: '',
      description: '',
      sku: '',
      category: '',
      basePrice: '',
      costPrice: '',
      markup: '',
      taxable: true,
      trackInventory: false,
      currentStock: '',
      minStockLevel: '',
      maxStockLevel: '',
      unit: 'each',
      weight: '',
      dimensions: '',
      duration: '',
      laborRate: '',
      active: true,
      notes: '',
      tags: []
    });
    setPricingTiers([]);
    setItemType('product');
  };

  const isFormValid = () => {
    return itemData.name && itemData.basePrice && itemData.category;
  };

  const getStockStatus = () => {
    const current = parseFloat(itemData.currentStock) || 0;
    const min = parseFloat(itemData.minStockLevel) || 0;
    
    if (current <= 0) return { status: 'out', color: 'text-red-600', icon: <AlertTriangle className="w-4 h-4" /> };
    if (current <= min) return { status: 'low', color: 'text-yellow-600', icon: <AlertTriangle className="w-4 h-4" /> };
    return { status: 'good', color: 'text-green-600', icon: <CheckCircle className="w-4 h-4" /> };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="space-y-0">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Add Product or Service
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Create items for faster estimate and invoice creation
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Item Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Item Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={itemType === 'product' ? 'default' : 'outline'}
                    onClick={() => setItemType('product')}
                    className="h-auto p-6 flex flex-col items-center gap-3"
                  >
                    <Package className="w-8 h-8" />
                    <div className="text-center">
                      <div className="font-semibold">Product</div>
                      <div className="text-sm text-gray-500">Physical items you sell</div>
                    </div>
                  </Button>
                  <Button
                    variant={itemType === 'service' ? 'default' : 'outline'}
                    onClick={() => setItemType('service')}
                    className="h-auto p-6 flex flex-col items-center gap-3"
                  >
                    <Wrench className="w-8 h-8" />
                    <div className="text-center">
                      <div className="font-semibold">Service</div>
                      <div className="text-sm text-gray-500">Labor or services you provide</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="inventory" disabled={itemType === 'service'}>
                  {itemType === 'product' ? 'Inventory' : 'Details'}
                </TabsTrigger>
                <TabsTrigger value="additional">Additional</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{itemType === 'product' ? 'Product' : 'Service'} Name *</Label>
                    <Input
                      id="name"
                      value={itemData.name}
                      onChange={(e) => setItemData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={itemType === 'product' ? 'Premium Widget' : 'Consultation Service'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU / Code</Label>
                    <Input
                      id="sku"
                      value={itemData.sku}
                      onChange={(e) => setItemData(prev => ({ ...prev, sku: e.target.value }))}
                      placeholder="PROD-001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={itemData.category} onValueChange={(value) => setItemData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select value={itemData.unit} onValueChange={(value) => setItemData(prev => ({ ...prev, unit: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={itemData.description}
                    onChange={(e) => setItemData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={`Detailed description of the ${itemType}...`}
                    rows={3}
                  />
                </div>

                {itemType === 'service' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Typical Duration</Label>
                      <Input
                        id="duration"
                        value={itemData.duration}
                        onChange={(e) => setItemData(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="2 hours"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="laborRate">Labor Rate ($/hour)</Label>
                      <Input
                        id="laborRate"
                        type="number"
                        step="0.01"
                        value={itemData.laborRate}
                        onChange={(e) => setItemData(prev => ({ ...prev, laborRate: e.target.value }))}
                        placeholder="75.00"
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basePrice">Base Price *</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      step="0.01"
                      value={itemData.basePrice}
                      onChange={(e) => {
                        setItemData(prev => ({ ...prev, basePrice: e.target.value }));
                        setTimeout(calculateMarkup, 100);
                      }}
                      placeholder="100.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Cost Price</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      step="0.01"
                      value={itemData.costPrice}
                      onChange={(e) => {
                        setItemData(prev => ({ ...prev, costPrice: e.target.value }));
                        setTimeout(calculateMarkup, 100);
                      }}
                      placeholder="60.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="markup">Markup (%)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="markup"
                        type="number"
                        step="0.01"
                        value={itemData.markup}
                        onChange={(e) => setItemData(prev => ({ ...prev, markup: e.target.value }))}
                        placeholder="66.67"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={calculatePriceFromMarkup}
                        className="px-3"
                      >
                        <Calculator className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="taxable"
                    checked={itemData.taxable}
                    onCheckedChange={(checked) => setItemData(prev => ({ ...prev, taxable: checked }))}
                  />
                  <Label htmlFor="taxable">Taxable item</Label>
                </div>

                {/* Volume Pricing */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="w-5 h-5" />
                        Volume Pricing
                      </CardTitle>
                      <Button onClick={addPricingTier} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Tier
                      </Button>
                    </div>
                  </CardHeader>
                  {pricingTiers.length > 0 && (
                    <CardContent className="space-y-4">
                      {pricingTiers.map((tier) => (
                        <div key={tier.id} className="grid grid-cols-12 gap-4 items-end">
                          <div className="col-span-4">
                            <Label className="text-sm">Tier Name</Label>
                            <Input
                              value={tier.name}
                              onChange={(e) => updatePricingTier(tier.id, 'name', e.target.value)}
                              placeholder="Bulk Pricing"
                            />
                          </div>
                          <div className="col-span-3">
                            <Label className="text-sm">Min Quantity</Label>
                            <Input
                              type="number"
                              value={tier.minQuantity}
                              onChange={(e) => updatePricingTier(tier.id, 'minQuantity', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div className="col-span-4">
                            <Label className="text-sm">Price per Unit</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={tier.price}
                              onChange={(e) => updatePricingTier(tier.id, 'price', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="col-span-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePricingTier(tier.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              </TabsContent>

              {/* Inventory Tab (Products only) */}
              <TabsContent value="inventory" className="mt-6 space-y-6">
                {itemType === 'product' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="trackInventory"
                        checked={itemData.trackInventory}
                        onCheckedChange={(checked) => setItemData(prev => ({ ...prev, trackInventory: checked }))}
                      />
                      <Label htmlFor="trackInventory">Track inventory for this product</Label>
                    </div>

                    {itemData.trackInventory && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Barcode className="w-5 h-5" />
                            Inventory Management
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="currentStock">Current Stock</Label>
                              <Input
                                id="currentStock"
                                type="number"
                                value={itemData.currentStock}
                                onChange={(e) => setItemData(prev => ({ ...prev, currentStock: e.target.value }))}
                                placeholder="100"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="minStockLevel">Min Stock Level</Label>
                              <Input
                                id="minStockLevel"
                                type="number"
                                value={itemData.minStockLevel}
                                onChange={(e) => setItemData(prev => ({ ...prev, minStockLevel: e.target.value }))}
                                placeholder="10"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="maxStockLevel">Max Stock Level</Label>
                              <Input
                                id="maxStockLevel"
                                type="number"
                                value={itemData.maxStockLevel}
                                onChange={(e) => setItemData(prev => ({ ...prev, maxStockLevel: e.target.value }))}
                                placeholder="500"
                              />
                            </div>
                          </div>

                          {itemData.currentStock && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                {getStockStatus().icon}
                                <span className={`font-medium ${getStockStatus().color}`}>
                                  Stock Status: {getStockStatus().status.charAt(0).toUpperCase() + getStockStatus().status.slice(1)}
                                </span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          value={itemData.weight}
                          onChange={(e) => setItemData(prev => ({ ...prev, weight: e.target.value }))}
                          placeholder="2.5 lbs"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dimensions">Dimensions</Label>
                        <Input
                          id="dimensions"
                          value={itemData.dimensions}
                          onChange={(e) => setItemData(prev => ({ ...prev, dimensions: e.target.value }))}
                          placeholder="12 x 8 x 4 inches"
                        />
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Additional Information Tab */}
              <TabsContent value="additional" className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={itemData.notes}
                    onChange={(e) => setItemData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional information about this item..."
                    rows={4}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Tags</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} variant="outline">
                      <Tag className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  {itemData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {itemData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={itemData.active}
                    onCheckedChange={(checked) => setItemData(prev => ({ ...prev, active: checked }))}
                  />
                  <Label htmlFor="active">Active (available for use in estimates and invoices)</Label>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!isFormValid()}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save {itemType === 'product' ? 'Product' : 'Service'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}