module PortfolioGenerator
  class WorksGenerator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      works_dir = site.config['works_dir'] || 'works'
      full_works_path = File.join(site.source, works_dir)
      
      return unless Dir.exist?(full_works_path)

      categories = []
      projects = []

      # 1. Scan Categories
      Dir.children(full_works_path).each do |cat_name|
        cat_path = File.join(full_works_path, cat_name)
        next unless File.directory?(cat_path)

        cat_slug = slugify_tr(cat_name)
        cat_projects = []

        # 2. Scan Projects within Category
        Dir.children(cat_path).each do |proj_name|
          proj_path = File.join(cat_path, proj_name)
          next unless File.directory?(proj_path)

          proj_slug = slugify_tr(proj_name)
          media_files = get_media_files(proj_path)
          next if media_files.empty? # Skip if no media

          # Process description
          description = ""
          desc_files = Dir.glob(File.join(proj_path, '*.txt'))
          if desc_files.any?
            description = File.read(desc_files.first).strip
          end

          # Create Project Data
          project_data = {
            'title' => proj_name,
            'category' => cat_name,
            'category_slug' => cat_slug,
            'category_url' => "/works/#{cat_slug}/",
            'slug' => proj_slug,
            'url' => "/works/#{cat_slug}/#{proj_slug}/",
            'thumbnail_path' => "/#{works_dir}/#{cat_name}/#{proj_name}/#{media_files.first}",
            'media_gallery' => media_files.map { |f| "/#{works_dir}/#{cat_name}/#{proj_name}/#{f}" },
            'description' => description,
            'order' => projects.length # Simple ordering
          }
          
          projects << project_data
          cat_projects << project_data

          # Generate Project Page
          site.pages << ProjectPage.new(site, site.source, project_data)
        end

        # Create Category Data
        if cat_projects.any?
          thumbnail = cat_projects.first['thumbnail_path']
          
          category_data = {
            'title' => cat_name,
            'slug' => cat_slug,
            'url' => "/works/#{cat_slug}/",
            'thumbnail' => thumbnail,
            'project_count' => cat_projects.length
          }
          
          categories << category_data

          # Generate Category Page
          site.pages << CategoryPage.new(site, site.source, category_data)
        end
      end

      # Expose data to site
      site.data['portfolio_categories'] = categories
      site.data['portfolio_projects'] = projects
      site.config['portfolio_categories'] = categories
      site.config['portfolio_projects'] = projects
    end

    private

    def get_media_files(path)
      valid_exts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4']
      files = Dir.children(path).select do |f|
        valid_exts.include?(File.extname(f).downcase) && !f.start_with?('.')
      end
      
      # Natural sort (e.g. 1.jpg, 2.jpg, 10.jpg)
      files.sort_by { |s| s.scan(/\d+/).map(&:to_i) }
    end

    def slugify_tr(str)
      tr_map = {
        'ı' => 'i', 'İ' => 'i', 'ğ' => 'g', 'Ğ' => 'g',
        'ü' => 'u', 'Ü' => 'u', 'ş' => 's', 'Ş' => 's',
        'ö' => 'o', 'Ö' => 'o', 'ç' => 'c', 'Ç' => 'c'
      }
      str.downcase.gsub(/[ıİğĞüÜşŞöÖçÇ]/, tr_map).strip.gsub(/[^a-z0-9]+/, '-').gsub(/^-|-$/, '')
    end
  end

  class CategoryPage < Jekyll::Page
    def initialize(site, base, category)
      @site = site
      @base = base
      @dir  = "works/#{category['slug']}"
      @name = 'index.html'

      self.process(@name)
      self.data ||= {}
      
      self.data['layout'] = 'category'
      self.data['title'] = category['title']
      self.data['category'] = category
    end
  end

  class ProjectPage < Jekyll::Page
    def initialize(site, base, project)
      @site = site
      @base = base
      @dir  = "works/#{project['category_slug']}/#{project['slug']}"
      @name = 'index.html'

      self.process(@name)
      self.data ||= {}
      
      self.data['layout'] = 'project'
      self.data['title'] = project['title']
      self.data['category'] = project['category']
      self.data['category_slug'] = project['category_slug']
      self.data['category_url'] = project['category_url']
      self.data['thumbnail_path'] = project['thumbnail_path']
      self.data['media_gallery'] = project['media_gallery']
      self.data['description'] = project['description']
    end
  end
end
