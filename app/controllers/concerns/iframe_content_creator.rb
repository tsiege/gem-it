class Concerns::IframeContentCreator
  attr_accessor :page, :file, :digest, :doc

  def initialize(params)
    @page = params[:website] !~ /http/ ? "http://#{params[:website]}" : params[:website] 
    @doc = open(page)
    @digest = Digest::MD5.hexdigest(page)
    @file = File.new("public/tmp/#{digest}.html", 'w')
  end

  def create_iframe_file
    file.write(content)
    file.close
  end

  def content
    @content ||= doc.read.gsub(/<script[^>]*>[^<]*<\/script>/, "<script></script>")
    @content ||= content.gsub(/<meta[^[Xx]]*[Xx]-[Ff][rame]*[-][Oo][ptions]*[^>]*\/>/, "")
  end
end